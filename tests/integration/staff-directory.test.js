import test from 'node:test';
import assert from 'node:assert/strict';
import {
  database,
  createRequest,
  asUser,
  USERS,
} from '../support/database.js';
import { staffDirectory } from '../../src/features/workflow/service.js';

let db;

test.before(async () => {
  db = await database();
});

test.after(async () => {
  await db?.close();
});

function clientFor(userId, { staffRows } = {}) {
  return {
    auth: {
      async getUser() {
        return {
          data: {
            user: userId ? { id: userId } : null,
          },
          error: null,
        };
      },
    },

    from(table) {
      return {
        select(columns) {
          const filters = [];

          const query = {
            eq(column, value) {
              filters.push({ column, value });
              return query;
            },

            async maybeSingle() {
              return asUser(db, userId, async (tx) => {
                const allowedTables = {
                  service_members: [
                    'user_id',
                    'role',
                    'display_name',
                    'can_view_sensitive',
                  ],
                  requests: [
                    'request_id',
                    'category_id',
                    'sensitive_information',
                    'requester_id',
                    'title',
                    'description',
                    'location',
                    'status_id',
                    'created_at',
                    'version',
                  ],
                  service_scopes: ['user_id', 'category_id'],
                };

                assert.ok(
                  allowedTables[table],
                  `Unexpected table: ${table}`,
                );

                const selectedColumns =
                  columns === '*'
                    ? allowedTables[table]
                    : columns.split(',').map((column) => column.trim());

                assert.ok(
                  selectedColumns.every((column) =>
                    allowedTables[table].includes(column),
                  ),
                  `Unexpected column selection for ${table}: ${columns}`,
                );

                const where = filters
                  .map((filter, index) => {
                    assert.ok(
                      allowedTables[table].includes(filter.column),
                      `Unexpected filter column: ${filter.column}`,
                    );
                    return `${filter.column} = $${index + 1}`;
                  })
                  .join(' and ');

                const values = filters.map((filter) => filter.value);

                const result = await tx.query(
                  `select ${selectedColumns.join(', ')} from ${table}${
                    where ? ` where ${where}` : ''
                  } limit 1`,
                  values,
                );

                return {
                  data: result.rows[0] ?? null,
                  error: null,
                };
              });
            },
          };

          return query;
        },
      };
    },

    async rpc(name) {
      assert.equal(name, 'm3_staff_directory');

      return asUser(db, userId, async (tx) => {
        const result = await tx.query(
          'select * from m3_staff_directory()',
        );

        return {
          data: staffRows ?? result.rows,
          error: null,
        };
      });
    },
  };
}

test('SD01: manager receives eligible staff for a normal request', async () => {
  const request = await createRequest(db);

  const result = await staffDirectory(
    clientFor(USERS.manager),
    request.request_id,
  );

  assert.ok(Array.isArray(result.staff));
  assert.ok(
    result.staff.some((member) => member.user_id === USERS.staff),
  );

  assert.ok(
    result.staff.every(
      (member) =>
        Object.keys(member).sort().join(',') === 'display_name,user_id',
    ),
    'Directory entries must expose only user_id and display_name',
  );
});

test('SD02: sensitive requests exclude staff without clearance', async () => {
  const request = await createRequest(db, USERS.requester, true);

  await db.query(
    'update service_members set can_view_sensitive = true where user_id = $1',
    [USERS.manager],
  );

  const result = await staffDirectory(
    clientFor(USERS.manager),
    request.request_id,
  );

  assert.ok(
    result.staff.some((member) => member.user_id === USERS.staff),
    'Staff with sensitive-data clearance should be included',
  );

  assert.ok(
    !result.staff.some(
      (member) => member.user_id === USERS.restricted,
    ),
    'Staff without sensitive-data clearance must be excluded',
  );
});

test('SD03: non-managers cannot access the directory', async () => {
  const request = await createRequest(db);

  for (const userId of [
    USERS.staff,
    USERS.requester,
    USERS.admin,
  ]) {
    await assert.rejects(
      staffDirectory(clientFor(userId), request.request_id),
      (error) => error.status === 403,
    );
  }
});

test('SD04: invalid and unavailable requests return the same safe error', async () => {
  for (const requestId of [
    'not-a-uuid',
    '99999999-9999-4999-8999-999999999999',
  ]) {
    await assert.rejects(
      staffDirectory(clientFor(USERS.manager), requestId),
      (error) =>
        error.status === 404 &&
        error.message === 'Request unavailable.',
    );
  }
});

test('SD05: manager cannot view requests outside their category scope', async () => {
  const request = await createRequest(db);

  // Remove the manager's scope to simulate an out-of-scope request.
  await db.query(
    'delete from service_scopes where user_id = $1 and category_id = $2',
    [USERS.manager, request.category_id],
  );

  try {
    await assert.rejects(
      staffDirectory(clientFor(USERS.manager), request.request_id),
      (error) =>
        error.status === 404 &&
        error.message === 'Request unavailable.',
    );
  } finally {
    // Restore the scope so this test does not affect later tests.
    await db.query(
      `insert into service_scopes (user_id, category_id)
       values ($1, $2)
       on conflict do nothing`,
      [USERS.manager, request.category_id],
    );
  }
});

test('SD06: staff directory is sorted alphabetically by display name', async () => {
  const request = await createRequest(db);

  const result = await staffDirectory(
    clientFor(USERS.manager),
    request.request_id,
  );

  const names = result.staff.map((member) => member.display_name);

  assert.deepEqual(
    names,
    [...names].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' }),
    ),
    'Staff should be sorted alphabetically by display name',
  );
});

test('SD07: staff directory returns each staff member only once', async () => {
  const request = await createRequest(db);

  const duplicateStaff = {
    user_id: USERS.staff,
    display_name: 'Test Staff',
    category_id: request.category_id,
    can_view_sensitive: true,
  };

  const result = await staffDirectory(
    clientFor(USERS.manager, {
      staffRows: [
        duplicateStaff,
        { ...duplicateStaff },
      ],
    }),
    request.request_id,
  );

  const staffIds = result.staff.map((member) => member.user_id);

  assert.equal(
    staffIds.filter((id) => id === USERS.staff).length,
    1,
    'Each staff member should appear only once',
  );
});
