import test from 'node:test';
import assert from 'node:assert/strict';
import {database,USERS,asUser,createRequest,rpc} from '../support/database.js';
let db;
test.before(async()=>{db=await database();});
test.after(async()=>{await db?.close();});
test('DB01 FR-001/010: insert creates Submitted status, time and attributable history',async()=>{
 const r=await createRequest(db);
 const {rows}=await db.query('select s.name,h.changed_by,h.changed_at from status_history h join statuses s using(status_id) where request_id=$1',[r.request_id]);
 assert.equal(rows.length,1);assert.equal(rows[0].name,'Submitted');assert.equal(rows[0].changed_by,USERS.requester);assert.equal(new Date(rows[0].changed_at).getTime(),new Date(r.created_at).getTime());
});
test('DB02 NFR-001/002: other requester and admin cannot read a request',async()=>{
 const r=await createRequest(db);
 for(const u of [USERS.other,USERS.admin])assert.equal((await asUser(db,u,tx=>tx.query('select * from requests where request_id=$1',[r.request_id]))).rows.length,0);
});
test('DB03 NFR-002: sensitive request requires scoped clearance',async()=>{
 const r=await createRequest(db,USERS.requester,true);
 for(const u of [USERS.manager,USERS.restricted])assert.equal((await asUser(db,u,tx=>tx.query('select * from requests where request_id=$1',[r.request_id]))).rows.length,0);
 assert.equal((await asUser(db,USERS.staff,tx=>tx.query('select * from requests where request_id=$1',[r.request_id]))).rows.length,1);
});
test('DB04 FR-010/NFR-003: accept, assign, work, resolve and close preserve audit',async()=>{
 const r=await createRequest(db);
 await rpc(db,USERS.staff,r.request_id,1,'transition',{status:'Accepted'});
 await rpc(db,USERS.manager,r.request_id,2,'assign',{assignedTo:USERS.staff});
 await rpc(db,USERS.staff,r.request_id,3,'transition',{status:'In Progress'});
 await rpc(db,USERS.staff,r.request_id,4,'transition',{status:'Resolved',note:'Fictional fix completed'});
 await rpc(db,USERS.manager,r.request_id,5,'transition',{status:'Closed',note:'Closure verified'});
 const {rows}=await db.query('select h.changed_by,s.name from status_history h join statuses s using(status_id) where request_id=$1 order by changed_at',[r.request_id]);
 assert.deepEqual(rows.map(h=>h.name),['Submitted','Accepted','Assigned','In Progress','Resolved','Closed']);assert.ok(rows.every(h=>h.changed_by));
});
test('DB05 FR-010: skipped transition rolls back without history/version change',async()=>{
 const r=await createRequest(db);
 await assert.rejects(rpc(db,USERS.staff,r.request_id,1,'transition',{status:'Closed',note:'Invalid'}),/Invalid lifecycle/);
 assert.equal((await db.query('select version from requests where request_id=$1',[r.request_id])).rows[0].version,1);
 assert.equal((await db.query('select * from status_history where request_id=$1',[r.request_id])).rows.length,1);
});
test('DB06 NFR-005: stale version update rejected',async()=>{
 const r=await createRequest(db);await rpc(db,USERS.staff,r.request_id,1,'transition',{status:'Accepted'});
 const before=(await db.query('select to_jsonb(r) request from requests r where request_id=$1',[r.request_id])).rows[0];
 await assert.rejects(rpc(db,USERS.manager,r.request_id,1,'assign',{assignedTo:USERS.staff}),e=>e.code==='PT409'&&/reload and retry/.test(e.message));
 assert.deepEqual((await db.query('select to_jsonb(r) request from requests r where request_id=$1',[r.request_id])).rows[0],before);
 assert.equal((await db.query('select * from assignments where request_id=$1',[r.request_id])).rows.length,0);
 assert.equal((await db.query('select * from status_history where request_id=$1',[r.request_id])).rows.length,2);
});
test('DB07 FR-011: private staff comment is invisible to requester',async()=>{
 const r=await createRequest(db);await rpc(db,USERS.staff,r.request_id,1,'comment',{note:'Internal fictional note',visible:false});
 assert.equal((await asUser(db,USERS.requester,tx=>tx.query('select * from request_comments where request_id=$1',[r.request_id]))).rows.length,0);
 assert.equal((await asUser(db,USERS.staff,tx=>tx.query('select * from request_comments where request_id=$1',[r.request_id]))).rows.length,1);
});
test('DB08 NFR-001: requester cannot call staff operation or direct update',async()=>{
 const r=await createRequest(db);
 await assert.rejects(rpc(db,USERS.requester,r.request_id,1,'transition',{status:'Accepted'}),/not permitted/);
 await assert.rejects(asUser(db,USERS.requester,tx=>tx.query('update requests set version=99 where request_id=$1',[r.request_id])),/permission denied/);
});
test('DB09 FR-009: manager cannot assign staff outside category scope',async()=>{
 const r=await createRequest(db);await rpc(db,USERS.staff,r.request_id,1,'transition',{status:'Accepted'});
 await assert.rejects(rpc(db,USERS.manager,r.request_id,2,'assign',{assignedTo:USERS.admin}),/not authorised/);
});
test('DB10 FR-010: reopening request records reason without changing terminal status',async()=>{
 const r=await createRequest(db);await rpc(db,USERS.staff,r.request_id,1,'transition',{status:'Rejected',note:'Wrong service'});
 await rpc(db,USERS.requester,r.request_id,2,'reopen',{note:'Additional details available'});
 assert.equal((await db.query('select s.name from requests r join statuses s using(status_id) where request_id=$1',[r.request_id])).rows[0].name,'Rejected');
 assert.equal((await db.query('select requested_by from reopening_requests where request_id=$1',[r.request_id])).rows[0].requested_by,USERS.requester);
});
test('DB11 FR-001/NFR-002: staged attachment linking enforces ownership and read access',async()=>{
 const r=await createRequest(db);const key=`${r.request_id}/test.pdf`;
 await asUser(db,USERS.requester,tx=>tx.query('insert into storage.objects(bucket_id,name,owner_id) values($1,$2,$3)',['request-attachments',key,USERS.requester]));
 await assert.rejects(asUser(db,USERS.other,tx=>tx.query('select m3_link_attachment($1,$2)',[r.request_id,key])),/unavailable/);
 await asUser(db,USERS.requester,tx=>tx.query('select m3_link_attachment($1,$2)',[r.request_id,key]));
 assert.equal((await asUser(db,USERS.other,tx=>tx.query('select * from storage.objects where name=$1',[key]))).rows.length,0);
 assert.equal((await asUser(db,USERS.requester,tx=>tx.query('select * from storage.objects where name=$1',[key]))).rows.length,1);
});
test('DB12 NFR-005: failed initial-history write rolls back the request',async()=>{
 await db.exec(`create function fail_history_for_test() returns trigger language plpgsql as $$begin raise exception 'Injected history failure';end;$$;
 create trigger test_history_failure before insert on status_history for each row execute function fail_history_for_test();`);
 const before=(await db.query('select count(*)::integer n from requests')).rows[0].n;
 try{await assert.rejects(createRequest(db),/Injected history failure/);assert.equal((await db.query('select count(*)::integer n from requests')).rows[0].n,before);}
 finally{await db.exec('drop trigger test_history_failure on status_history;drop function fail_history_for_test();');}
});

test('DB13 NFR-002: direct insert cannot forge an attachment link',async()=>{
 await assert.rejects(asUser(db,USERS.other,tx=>tx.query(`insert into requests(title,description,location,requester_id,category_id,sensitive_information,attachment_reference)
 select 'Forgery','Fictional','Hall',q.requester_id,c.category_id,false,'someone-elses-request/file.pdf'
 from requesters q,categories c where q.auth_user_id=auth.uid() and c.name='Maintenance'`)),/row-level security/);
});

test('DB14 attachment recovery: owner can delete an unlinked staged file',async()=>{
 const r=await createRequest(db);const key=`${r.request_id}/staged.pdf`;
 await asUser(db,USERS.requester,tx=>tx.query('insert into storage.objects(bucket_id,name,owner_id) values($1,$2,$3)',['request-attachments',key,USERS.requester]));
 const deleted=await asUser(db,USERS.requester,tx=>tx.query('delete from storage.objects where name=$1 returning name',[key]));
 assert.equal(deleted.rows.length,1);
});
