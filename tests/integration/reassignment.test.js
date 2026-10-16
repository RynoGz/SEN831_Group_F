import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {database,createRequest,rpc,asUser,USERS} from '../support/database.js';
let db;
test.before(async()=>{db=await database();});
test.after(async()=>{await db?.close();});
async function assigned(){
 const r=await createRequest(db);
 await rpc(db,USERS.staff,r.request_id,1,'transition',{status:'Accepted'});
 await rpc(db,USERS.manager,r.request_id,2,'assign',{assignedTo:USERS.staff});
 return r;
}
async function state(id){return (await db.query('select to_jsonb(r) request,(select jsonb_agg(to_jsonb(a) order by assigned_at,assignment_id) from assignments a where a.request_id=r.request_id) assignments from requests r where r.request_id=$1',[id])).rows[0];}
test('CRDB01: initial assignment and saving same assignee need no reason',async()=>{
 const r=await assigned();await rpc(db,USERS.manager,r.request_id,3,'assign',{assignedTo:USERS.staff});
 assert.equal((await db.query('select version from requests where request_id=$1',[r.request_id])).rows[0].version,4);
});
test('CRDB02: blank reassignment reasons reject atomically through direct RPC',async()=>{
 const r=await assigned();const before=await state(r.request_id);
 for(const note of [null,'',' ','\t\n','\u00a0','\ufeff','\u2003','\u2028','\u3000']){
  await assert.rejects(rpc(db,USERS.manager,r.request_id,3,'assign',{assignedTo:USERS.restricted,note,targetAt:'2026-12-01T10:00:00Z'}),/Enter a reason/);
  assert.deepEqual(await state(r.request_id),before);
 }
});
test('CRDB03: reassignment retains original history and saves reason actor and time',async()=>{
 const r=await assigned();await rpc(db,USERS.staff,r.request_id,3,'transition',{status:'In Progress'});
 await rpc(db,USERS.manager,r.request_id,4,'assign',{assignedTo:USERS.restricted,note:'  Covering the original staff member  '});
 const rows=(await asUser(db,USERS.manager,tx=>tx.query('select * from m3_assignment_history($1)',[r.request_id]))).rows;
 assert.equal(rows.length,2);assert.equal(rows[0].assigned_to,USERS.restricted);assert.equal(rows[0].assigned_by,USERS.manager);assert.ok(rows[0].assigned_at);
 assert.equal(rows[0].reason,'Covering the original staff member');assert.equal(rows[1].assigned_to,USERS.staff);
 assert.equal((await db.query('select s.name,r.version from requests r join statuses s using(status_id) where request_id=$1',[r.request_id])).rows[0].name,'In Progress');
});
test('CRDB04: 4000 characters accepted and 4001 rejected without mutation',async()=>{
 const r=await assigned();const before=await state(r.request_id);
 await assert.rejects(rpc(db,USERS.manager,r.request_id,3,'assign',{assignedTo:USERS.restricted,note:'a'.repeat(4001)}),/4000/);
 assert.deepEqual(await state(r.request_id),before);
 await rpc(db,USERS.manager,r.request_id,3,'assign',{assignedTo:USERS.restricted,note:'a'.repeat(4000)});
});
test('CRDB05: valid reasons do not bypass permissions scope or stale versions',async()=>{
 const r=await assigned();const before=await state(r.request_id);
 for(const actor of [USERS.staff,USERS.requester])await assert.rejects(rpc(db,actor,r.request_id,3,'assign',{assignedTo:USERS.restricted,note:'Fictional reason'}),/permitted|managers/);
 await assert.rejects(rpc(db,USERS.manager,r.request_id,3,'assign',{assignedTo:USERS.admin,note:'Fictional reason'}),/authorised/);
 await assert.rejects(rpc(db,USERS.manager,r.request_id,2,'assign',{assignedTo:USERS.restricted,note:'Fictional reason'}),/reload and retry/);
 assert.deepEqual(await state(r.request_id),before);
});
test('CRDB06: private reasons remain hidden from requester and direct column reads',async()=>{
 const r=await assigned();await rpc(db,USERS.manager,r.request_id,3,'assign',{assignedTo:USERS.restricted,note:'Fictional internal reason',visible:false});
 const read=who=>asUser(db,who,tx=>tx.query('select * from m3_assignment_history($1)',[r.request_id]));
 assert.equal((await read(USERS.manager)).rows[0].reason,'Fictional internal reason');
 assert.equal((await read(USERS.requester)).rows[0].reason,null);
 assert.equal((await read(USERS.other)).rows.length,0);
 await assert.rejects(asUser(db,USERS.requester,tx=>tx.query('select reason from assignments where request_id=$1',[r.request_id])),/permission denied/);
});
test('CRDB07: migration preserves existing assignment data without invented reasons',async()=>{
 const legacy=await database({throughMigration:6});
 try{
  const r=await createRequest(legacy);await rpc(legacy,USERS.staff,r.request_id,1,'transition',{status:'Accepted'});
  await rpc(legacy,USERS.manager,r.request_id,2,'assign',{assignedTo:USERS.staff,note:'Existing assignment note'});
  const before=(await legacy.query('select * from assignments where request_id=$1',[r.request_id])).rows[0];
  await legacy.exec(await readFile(new URL('../../supabase/migrations/007_m3_reassignment_reason.sql',import.meta.url),'utf8'));
  const after=(await legacy.query('select * from assignments where request_id=$1',[r.request_id])).rows[0];
  for(const [key,value] of Object.entries(before))assert.deepEqual(after[key],value);
  assert.equal(after.reason,null);
  assert.equal((await legacy.query('select body from request_comments where request_id=$1',[r.request_id])).rows[0].body,'Existing assignment note');
  await assert.rejects(rpc(legacy,USERS.manager,r.request_id,3,'assign',{assignedTo:USERS.restricted}),/Enter a reason/);
 }finally{await legacy.close();}
});

test('CRDB08: conflict migration preserves existing reasons, permissions and valid workflow',async()=>{
 const legacy=await database({throughMigration:7});
 try{
  const r=await createRequest(legacy);
  await rpc(legacy,USERS.staff,r.request_id,1,'transition',{status:'Accepted'});
  await rpc(legacy,USERS.manager,r.request_id,2,'assign',{assignedTo:USERS.staff,note:'Existing private note',visible:false});
  const snapshot=async()=>({
   request:(await legacy.query('select * from requests where request_id=$1',[r.request_id])).rows,
   assignments:(await legacy.query('select * from assignments where request_id=$1',[r.request_id])).rows,
   comments:(await legacy.query('select * from request_comments where request_id=$1',[r.request_id])).rows,
   privileges:(await legacy.query("select proacl,prosecdef,proconfig from pg_proc where oid='public.m3_change_request(uuid,integer,text,text,uuid,text,boolean,timestamp with time zone)'::regprocedure")).rows,
  });
  const before=await snapshot();
  const migration=await readFile(new URL('../../supabase/migrations/008_m3_version_conflict.sql',import.meta.url),'utf8');
  await legacy.exec(migration);
  await legacy.exec(migration);
  assert.deepEqual(await snapshot(),before);
  await assert.rejects(rpc(legacy,USERS.manager,r.request_id,2,'assign',{assignedTo:USERS.restricted,note:'Stale attempt'}),e=>e.code==='PT409');
  assert.deepEqual(await snapshot(),before);
  await rpc(legacy,USERS.manager,r.request_id,3,'assign',{assignedTo:USERS.restricted,note:'Valid current version'});
  const history=(await asUser(legacy,USERS.requester,tx=>tx.query('select * from m3_assignment_history($1)',[r.request_id]))).rows;
  assert.equal(history[0].reason,'Valid current version');assert.equal(history[1].reason,null);
  await assert.rejects(rpc(legacy,USERS.requester,r.request_id,4,'transition',{status:'In Progress'}),e=>e.code==='42501');
 }finally{await legacy.close();}
});
