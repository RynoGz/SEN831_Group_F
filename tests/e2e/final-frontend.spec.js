import { test, expect } from '@playwright/test';
import { MAX_ATTACHMENT_BYTES } from '../../src/features/attachments/attachment-store.js';

const id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const staffId = '33333333-3333-4333-8333-333333333333';
const members = [{ user_id: staffId, display_name: 'Eligible test staff' }];

function fixture(role = 'manager') {
  return {
    request: { request_id: id, title: 'Frontend contract check', description: 'Fictional interface fixture', location: 'Test hall', category_id: 'category', categories: { name: 'Maintenance' }, statuses: { name: 'Accepted' }, version: 3, created_at: '2026-10-17T08:00:00Z', sensitive_information: false },
    actor: { id: role === 'staff' ? staffId : '44444444-4444-4444-8444-444444444444', role, name: 'Test account', ownsRequest: role === 'requester', canWork: role !== 'requester' },
    assignments: [], history: [], comments: [], reopenings: [],
  };
}

async function workspace(page, role = 'manager') {
  const data = fixture(role);
  await page.route('**/api/session', route => route.fulfill({ json: data.actor }));
  await page.route(`**/api/requests/${id}`, route => route.fulfill({ json: data }));
  return data;
}

test('signed-out request creation returns to the same task after sign-in', async ({ page }) => {
  await page.goto('/requests/new');
  await expect(page).toHaveURL(/\/auth\/login\?next=/);
  await page.getByLabel('Email', { exact: true }).fill('requester@example.test');
  await page.getByLabel('Password', { exact: true }).fill('Fictional-test-password-1!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL('/requests/new');
  await expect(page.getByRole('heading', { name: 'New Request', exact: true })).toBeVisible();
});

test('submission explains an expired session and keeps the entered request', async ({ page }) => {
  await page.goto('/auth/login?next=/requests/new');
  await page.getByLabel('Email', { exact: true }).fill('requester@example.test');
  await page.getByLabel('Password', { exact: true }).fill('Fictional-test-password-1!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL('/requests/new');
  await page.getByLabel('Title', { exact: false }).fill('Preserved request title');
  await page.getByLabel('Description', { exact: false }).fill('Fictional session recovery check');
  await page.getByLabel('Category', { exact: false }).selectOption({ label: 'Maintenance' });
  await page.getByLabel('Location', { exact: false }).fill('Test hall');
  await page.getByRole('radio', { name: 'No', exact: true }).check();
  const signOut = await page.request.delete('/api/session', { headers: { origin: 'http://127.0.0.1:3103' } });
  expect(signOut.status()).toBe(200);
  await page.getByRole('button', { name: 'Submit request', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Please sign in.' })).toBeVisible();
  await expect(page.getByLabel('Title', { exact: false })).toHaveValue('Preserved request title');
  await expect(page.getByRole('heading', { name: 'Your request has been saved' })).toHaveCount(0);
});

test('a service account without a requester profile receives clear setup guidance', async ({ page }) => {
  await page.goto('/auth/login');
  await page.getByLabel('Email', { exact: true }).fill('staff@example.test');
  await page.getByLabel('Password', { exact: true }).fill('Fictional-test-password-1!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL('/work');
  await page.goto('/requests/new');
  await expect(page.getByRole('heading', { name: 'Requester profile needed' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit request', exact: true })).toHaveCount(0);
});

test('manager waits for eligible staff and explicitly selects before saving', async ({ page }) => {
  const data = await workspace(page);
  let release;
  const ready = new Promise(resolve => { release = resolve; });
  await page.route('**/api/staff-directory?*', async route => {
    expect(new URL(route.request().url()).searchParams.get('requestId')).toBe(id);
    await ready;
    await route.fulfill({ json: { staff: members } });
  });
  await page.goto(`/requests/${id}`);
  const select = page.getByLabel('Responsible staff');
  await expect(select).toBeDisabled();
  release();
  await expect(select).toBeEnabled();
  await expect(select).toHaveValue('');
  const save = page.getByRole('button', { name: 'Save assignment', exact: true });
  await expect(save).toBeDisabled();
  await select.selectOption(staffId);
  await expect(save).toBeEnabled();
  let submitted;
  await page.route(`**/api/requests/${id}`, async route => {
    if (route.request().method() === 'PATCH') {
      submitted = route.request().postDataJSON();
      return route.fulfill({ json: { id, version: 4 } });
    }
    return route.fulfill({ json: { ...data, request: { ...data.request, version: 4 } } });
  });
  await save.click();
  await expect(page.getByText('Update saved.', { exact: true })).toBeVisible();
  expect(submitted).toMatchObject({ operation: 'assign', version: 3, assignedTo: staffId });
});

test('empty eligible directory explains why assignment is unavailable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await workspace(page);
  await page.route('**/api/staff-directory?*', route => route.fulfill({ json: { staff: [] } }));
  await page.goto(`/requests/${id}`);
  await expect(page.getByText(/No eligible staff are available/)).toBeVisible();
  await expect(page.getByLabel('Responsible staff')).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Save assignment', exact: true })).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/frontend-directory-empty-mobile.png', fullPage: true });
});

test('directory failure can be retried and is never presented as no eligible staff', async ({ page }) => {
  await workspace(page);
  let attempts = 0;
  await page.route('**/api/staff-directory?*', route => ++attempts === 1
    ? route.fulfill({ status: 503, json: { error: 'Staff lookup is unavailable.' } })
    : route.fulfill({ json: { staff: members } }));
  await page.goto(`/requests/${id}`);
  await expect(page.getByRole('alert').filter({ hasText: 'Staff lookup is unavailable.' })).toBeVisible();
  await expect(page.getByText(/No eligible staff are available/)).toHaveCount(0);
  await page.screenshot({ path: 'test-results/frontend-directory-failure.png', fullPage: true });
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(page.getByLabel('Responsible staff')).toBeEnabled();
  await expect(page.getByLabel('Responsible staff')).toHaveValue('');
});

test('malformed staff results show a recoverable error instead of crashing', async ({ page }) => {
  await workspace(page);
  await page.route('**/api/staff-directory?*', route => route.fulfill({ json: { staff: [null] } }));
  await page.goto(`/requests/${id}`);
  await expect(page.getByRole('alert').filter({ hasText: 'Staff information could not be read.' })).toBeVisible();
  await expect(page.getByLabel('Responsible staff')).toBeDisabled();
});

test('an eligible current assignee stays selected and changing it still requires a reason', async ({ page }) => {
  const data = await workspace(page);
  data.assignments.push({ assignment_id: 'assignment', assigned_to: staffId, assigned_at: '2026-10-17T08:00:00Z' });
  await page.route(`**/api/requests/${id}`, route => route.fulfill({ json: data }));
  await page.route('**/api/staff-directory?*', route => route.fulfill({ json: { staff: [...members, { user_id: '66666666-6666-4666-8666-666666666666', display_name: 'Other eligible staff' }] } }));
  await page.goto(`/requests/${id}`);
  await expect(page.getByLabel('Responsible staff')).toHaveValue(staffId);
  await page.getByLabel('Responsible staff').selectOption('66666666-6666-4666-8666-666666666666');
  await page.getByRole('button', { name: 'Save assignment', exact: true }).click();
  await expect(page.locator('#assignment-error')).toHaveText('Enter a reason for changing the responsible staff member.');
  await expect(page.getByLabel('Reassignment reason (required)', { exact: true })).toBeFocused();
});

test('workflow saves stay disabled while authoritative details refresh', async ({ page }) => {
  const data = await workspace(page, 'staff');
  let reads = 0;
  let release;
  const ready = new Promise(resolve => { release = resolve; });
  await page.route(`**/api/requests/${id}`, async route => {
    if (route.request().method() === 'PATCH') return route.fulfill({ json: { id, version: 4 } });
    if (++reads > 1) await ready;
    return route.fulfill({ json: { ...data, request: { ...data.request, version: reads > 1 ? 4 : 3 } } });
  });
  await page.goto(`/requests/${id}`);
  await page.getByRole('button', { name: 'Save assignment', exact: true }).click();
  await expect(page.getByText('Refreshing…', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: data.request.title, exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save assignment', exact: true })).toBeDisabled();
  release();
  await expect(page.getByRole('button', { name: 'Save assignment', exact: true })).toBeEnabled();
});

test('staff self-assignment does not fetch a manager directory', async ({ page }) => {
  await workspace(page, 'staff');
  const calls = [];
  page.on('request', request => { if (request.url().includes('/api/staff-directory')) calls.push(request.url()); });
  await page.goto(`/requests/${id}`);
  await expect(page.getByLabel('Responsible staff')).toHaveValue(staffId);
  await expect(page.getByRole('button', { name: 'Save assignment', exact: true })).toBeEnabled();
  expect(calls).toHaveLength(0);
});

test('expired details session provides a sign-in recovery link', async ({ page }) => {
  await workspace(page);
  await page.route(`**/api/requests/${id}`, route => route.fulfill({ status: 401, json: { error: 'Please sign in.' } }));
  await page.goto(`/requests/${id}`);
  await expect(page.getByRole('link', { name: 'Sign in again' })).toHaveAttribute('href', `/auth/login?next=${encodeURIComponent(`/requests/${id}`)}`);
});

test('upload rejects a file above the shared limit before sending it', async ({ page }) => {
  await workspace(page, 'requester');
  let uploads = 0;
  page.on('request', request => { if (request.url().endsWith('/attachment') && request.method() === 'POST') uploads++; });
  await page.goto(`/requests/${id}`);
  await page.getByLabel('File', { exact: true }).setInputFiles({ name: 'oversized.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(MAX_ATTACHMENT_BYTES + 1) });
  await page.getByRole('button', { name: 'Upload attachment', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: `Choose a nonempty file up to ${MAX_ATTACHMENT_BYTES / (1024 * 1024)} MiB.` })).toBeVisible();
  expect(uploads).toBe(0);
});

test('an HTML upload failure gives readable recovery guidance and preserves the chosen file', async ({ page }) => {
  await workspace(page, 'requester');
  await page.route(`**/api/requests/${id}/attachment`, route => route.fulfill({ status: 413, contentType: 'text/html', body: '<h1>Hosting upload limit</h1>' }));
  await page.goto(`/requests/${id}`);
  await page.getByLabel('File', { exact: true }).setInputFiles({ name: 'fixture.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\nFictional') });
  await page.getByRole('button', { name: 'Upload attachment', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: /unexpected response/ })).toBeVisible();
  await expect(page.getByLabel('File', { exact: true })).toHaveValue(/fixture\.pdf$/);
});
