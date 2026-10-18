import test from 'node:test';
import assert from 'node:assert/strict';
import {
  database,
  USERS,
  asUser,
  createRequest,
} from '../support/database.js';

let db;

test.before(async () => {
  db = await database();
});

test.after(async () => {
  await db?.close();
});

test('M4: authenticated request creation cannot forge created_at', async () => {
  const forgedTimestamp = '2000-01-01T00:00:00.000Z';

  const request = await asUser(db, USERS.requester, async (tx) => {
    const result = await tx.query(
      `insert into requests (
        title,
        description,
        location,
        requester_id,
        category_id,
        sensitive_information,
        created_at
      )
      select
        'Timestamp integrity test',
        'Regression test',
        'Test location',
        q.requester_id,
        c.category_id,
        false,
        $1::timestamptz
      from requesters q, categories c
      where q.auth_user_id = auth.uid()
        and c.name = 'Maintenance'
      returning *`,
      [forgedTimestamp],
    );

    return result.rows[0];
  });

  assert.ok(request, 'The request should be created');

  assert.notEqual(
    new Date(request.created_at).getTime(),
    new Date(forgedTimestamp).getTime(),
    'The database must reject the client-supplied creation timestamp',
  );

  const { rows } = await db.query(
    `select h.changed_at
     from status_history h
     where h.request_id = $1`,
    [request.request_id],
  );

  assert.equal(rows.length, 1, 'Initial status history should be created');

  assert.equal(
    new Date(rows[0].changed_at).getTime(),
    new Date(request.created_at).getTime(),
    'Initial status history must retain the trusted creation timestamp',
  );
});