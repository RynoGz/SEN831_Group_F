import {test,expect} from '@playwright/test';
import {MAX_ATTACHMENT_BYTES} from '../../src/features/attachments/attachment-store.js';
async function login(page,name){await page.goto('/auth/login');await page.getByLabel('Email',{exact:true}).fill(`${name}@example.test`);await page.getByLabel('Password',{exact:true}).fill('Fictional-test-password-1!');await page.getByRole('button',{name:'Sign in',exact:true}).click();await expect(page).toHaveURL(/\/(requests|work|management)$/);}
async function submit(page,title){await page.goto('/requests/new');await page.getByLabel('Title',{exact:false}).fill(title);await page.getByLabel('Description',{exact:false}).fill('Fictional leak for controlled testing.');await page.getByLabel('Category',{exact:false}).selectOption({label:'Maintenance'});await page.getByLabel('Location',{exact:false}).fill('Test hall');await page.getByRole('radio',{name:'No',exact:true}).check();await page.getByRole('button',{name:'Submit request',exact:true}).click();await expect(page.getByRole('heading',{name:'Your request has been saved'})).toBeVisible();const link=page.getByRole('link',{name:'View request',exact:true});const href=await link.getAttribute('href');await link.click();await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();return href;}

test('W1API01: attachment HTTP boundaries, safe errors and private retrieval',async({page,browser,request})=>{
 await login(page,'requester');const href=await submit(page,`W1 boundary ${Date.now()}`);
 const url=`${href.replace('/requests/','/api/requests/')}/attachment`;
 const headers={origin:'http://127.0.0.1:3103'};
 const upload=buffer=>page.request.post(url,{headers,multipart:{file:{name:'fixture.pdf',mimeType:'application/pdf',buffer}}});
 for(const [bytes,status] of [[Buffer.alloc(0),400],[Buffer.from('invalid PDF'),400],[Buffer.alloc(MAX_ATTACHMENT_BYTES+1),413]]){
  const response=await upload(bytes);expect(response.status()).toBe(status);expect((await response.json()).error).toEqual(expect.any(String));
 }
 const malformed=await page.request.post(url,{headers:{...headers,'content-type':'multipart/form-data; boundary=missing'},data:'malformed'});
 expect(malformed.status()).toBe(400);
 expect((await request.get(url)).status()).toBe(401);
 const other=await browser.newContext();
 try{
  const p=await other.newPage();await login(p,'other');
  expect((await p.request.get(url)).status()).toBe(404);
  expect((await p.request.post(url,{headers,multipart:{file:{name:'fixture.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4')}}})).status()).toBe(404);
  const bytes=Buffer.alloc(MAX_ATTACHMENT_BYTES);bytes.write('%PDF-1.4');
  const saved=await upload(bytes);expect(saved.status()).toBe(200);expect(await saved.json()).toEqual({ok:true});
  const downloaded=await page.request.get(url);expect(downloaded.status()).toBe(200);expect(await downloaded.body()).toEqual(bytes);
  expect(downloaded.headers()['cache-control']).toBe('private, no-store');
  expect((await p.request.get(url)).status()).toBe(404);
  expect((await upload(Buffer.from('%PDF-1.4'))).status()).toBe(409);
 }finally{await other.close();}
});
test('E2E01 FR-001/003/004: sign in, validate, save, private attachment and retrieve',async({page})=>{
 await login(page,'requester');await page.goto('/requests/new');await page.getByRole('button',{name:'Submit request',exact:true}).click();await expect(page.getByRole('heading',{name:'Please check your request'})).toBeVisible();
 const title=`E2E requester ${Date.now()}`;const href=await submit(page,title);
 await page.getByLabel('File',{exact:true}).setInputFiles({name:'fictional.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\nFictional test fixture')});await page.getByRole('button',{name:'Upload attachment'}).click();await expect(page.getByRole('link',{name:'Download private attachment'})).toBeVisible();
 const download=await page.request.get(`${href.replace('/requests/','/api/requests/')}/attachment`);expect(download.status()).toBe(200);expect(await download.text()).toContain('%PDF-');
 await page.goto('/requests');await expect(page.getByRole('link',{name:title,exact:true})).toBeVisible();
 const other=await page.context().browser().newContext();const otherPage=await other.newPage();await login(otherPage,'other');await otherPage.goto(href);await expect(otherPage.getByRole('alert').filter({hasText:'Request unavailable.'})).toBeVisible();await other.close();
});
test('E2E02 FR-009/010/011/012/015: requester → staff → manager full lifecycle and reporting',async({page,browser})=>{
 await login(page,'requester');const title=`E2E lifecycle ${Date.now()}`;const href=await submit(page,title);
 const staff=await browser.newContext();const s=await staff.newPage();await login(s,'staff');await s.goto(href);await expect(s.getByRole('heading',{name:title,exact:true})).toBeVisible();
 await s.getByLabel('Next status').selectOption('Accepted');await s.getByRole('button',{name:'Save status'}).click();await expect(s.getByRole('heading',{name:'Assignment',exact:true})).toBeVisible();
 await s.getByRole('button',{name:'Save assignment'}).click();await expect(s.getByLabel('Next status')).toHaveValue('In Progress');await s.getByRole('button',{name:'Save status'}).click();await expect(s.getByLabel('Next status')).toHaveValue('Resolved');
 await s.getByLabel('Decision or resolution note').fill('Fictional repair complete');await s.getByRole('button',{name:'Save status'}).click();await expect.poll(async()=>{const r=await s.request.get(href.replace('/requests/','/api/requests/'));return (await r.json()).request.statuses.name;}).toBe('Resolved');await expect(s.getByText('Fictional repair complete',{exact:true})).toBeVisible();
 const manager=await browser.newContext();const p=await manager.newPage();await login(p,'manager');await p.goto(href);await p.getByLabel('Decision or resolution note').fill('Fictional closure verified');await p.getByRole('button',{name:'Save status'}).click();await expect(p.getByRole('heading',{name:'Reopening requests'})).toBeVisible();await p.goto('/management');await expect(p.getByRole('heading',{name:'By category'})).toBeVisible();
 await page.reload();await expect(page.getByText('Fictional repair complete',{exact:true})).toBeVisible();await expect(page.getByText('Fictional closure verified',{exact:true})).toBeVisible();
 await staff.close();await manager.close();
});
test('API01 NFR-001: anonymous request-details API denied',async({request})=>{const r=await request.get('/api/requests/11111111-1111-4111-8111-111111111111');expect(r.status()).toBe(401);});
test('API02 NFR-001: requester cannot retrieve work directory',async({page})=>{await login(page,'requester');const r=await page.request.get('/api/work');expect(r.status()).toBe(403);});
test('API03 FR-001: malformed request ID handled without internal error disclosure',async({page})=>{await login(page,'requester');const r=await page.request.get('/api/requests/not-a-uuid');expect(r.status()).toBe(404);expect(await r.json()).toEqual({error:'Request unavailable.'});});

test('API04 NFR-001: cross-origin mutation denied before database work',async({page})=>{
 await login(page,'requester');const r=await page.request.patch('/api/requests/11111111-1111-4111-8111-111111111111',{headers:{origin:'https://untrusted.example'},data:{version:1,operation:'transition',status:'Accepted'}});expect(r.status()).toBe(403);
});

test('API05 NFR-005: stale update returns a reload message and preserves the saved request',async({page,browser})=>{
 await login(page,'requester');const href=await submit(page,`Version conflict ${Date.now()}`);const api=href.replace('/requests/','/api/requests/');
 const context=await browser.newContext();
 try{
  const manager=await context.newPage();await login(manager,'manager');
  const before=await (await manager.request.get(api)).json();
  const patch=data=>manager.request.patch(api,{headers:{origin:'http://127.0.0.1:3103'},data,timeout:10000});
  expect((await patch({version:before.request.version,operation:'transition',status:'Accepted'})).status()).toBe(200);
  const saved=await (await manager.request.get(api)).json();
  const stale=await patch({version:before.request.version,operation:'comment',note:'Stale comment must not persist'});
  expect(stale.status()).toBe(409);expect(await stale.json()).toEqual({error:'This request has changed. Reload it and try again.'});
  expect(await (await manager.request.get(api)).json()).toEqual(saved);
  expect((await patch({version:saved.request.version,operation:'comment',note:'Current version succeeds'})).status()).toBe(200);
  const updated=await (await manager.request.get(api)).json();
  expect(updated.request.version).toBe(saved.request.version+1);expect(updated.comments.some(c=>c.body==='Current version succeeds')).toBe(true);
 }finally{await context.close();}
});

test('CRE2E01 FR-009: manager reassignment requires a reason and preserves history',async({page,browser})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 await login(page,'requester');const href=await submit(page,`Reassignment ${Date.now()}`);
 const context=await browser.newContext();const manager=await context.newPage();await login(manager,'manager');await manager.goto(href);
 await manager.getByLabel('Next status').selectOption('Accepted');await manager.getByRole('button',{name:'Save status',exact:true}).click();
 await expect(manager.getByRole('heading',{name:'Assignment',exact:true})).toBeVisible();
 await manager.getByLabel('Responsible staff').selectOption({label:'Fictional staff'});await manager.getByRole('button',{name:'Save assignment',exact:true}).click();
 await expect(manager.getByRole('heading',{name:'Assignment history',exact:true})).toBeVisible();
 await expect.poll(async()=>{const r=await manager.request.get(href.replace('/requests/','/api/requests/'));return (await r.json()).request.version;}).toBe(3);
 await manager.setViewportSize({width:390,height:844});await manager.emulateMedia({reducedMotion:'reduce'});
 await manager.getByLabel('Responsible staff').selectOption({label:'Fictional restricted'});
 const reason=manager.getByLabel('Reassignment reason (required)',{exact:true});await reason.fill('   ');
 await manager.getByRole('button',{name:'Save assignment',exact:true}).click();await expect(manager.locator('#assignment-error')).toHaveText('Enter a reason for changing the responsible staff member.');await expect(reason).toBeFocused();
 const api=href.replace('/requests/','/api/requests/');
 const rejected=await manager.request.patch(api,{headers:{origin:'http://127.0.0.1:3103'},data:{version:3,operation:'assign',assignedTo:'66666666-6666-4666-8666-666666666666',note:' '}});
 expect(rejected.status()).toBe(400);
 await reason.fill('Covering the original staff member');await manager.getByRole('button',{name:'Save assignment',exact:true}).click();
 await expect.poll(async()=>{const r=await manager.request.get(api);return (await r.json()).assignments[0]?.reason;}).toBe('Covering the original staff member');
 await manager.reload();const history=manager.locator('section').filter({has:manager.getByRole('heading',{name:'Assignment history',exact:true})});
 await expect(history).toContainText('Covering the original staff member');await expect(history.locator('article')).toHaveCount(2);
 expect(await manager.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await manager.screenshot({path:'test-results/reassignment-mobile.png',fullPage:true});
 await page.reload();await expect(page.locator('section').filter({has:page.getByRole('heading',{name:'Assignment history',exact:true})})).toContainText('Covering the original staff member');
 await context.close();
});
