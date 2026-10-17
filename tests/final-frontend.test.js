import test from 'node:test';
import assert from 'node:assert/strict';
import { signInDestination } from '../src/features/workflow/sign-in-destination.js';
import { readApiResponse } from '../src/features/workflow/api-response.js';

test('Final sign-in returns to an allowed task without accepting external destinations', () => {
  assert.equal(signInDestination('requester', '/requests/new'), '/requests/new');
  assert.equal(signInDestination('manager', '/work'), '/work');
  for (const value of ['https://untrusted.example', '//untrusted.example', '/\\untrusted.example', '/auth/login', '/management', undefined]) {
    assert.equal(signInDestination('requester', value), '/requests');
  }
  assert.equal(signInDestination('staff', '/management'), '/work');
  assert.equal(signInDestination('manager', null), '/management');
});

test('API failures retain safe feedback and the status needed for reauthentication and conflicts', async () => {
  for (const status of [401, 403, 409, 503]) {
    await assert.rejects(readApiResponse(Response.json({ error: 'Controlled failure' }, { status })), error => error.status === status && error.message === 'Controlled failure');
  }
});

test('Non-JSON hosting failures produce recovery guidance without leaking response content', async () => {
  await assert.rejects(readApiResponse(new Response('<html>Internal diagnostic</html>', { status: 413 })), error => error.status === 413 && /unexpected response/.test(error.message) && !error.message.includes('diagnostic'));
  assert.deepEqual(await readApiResponse(Response.json({ ok: true })), { ok: true });
});
