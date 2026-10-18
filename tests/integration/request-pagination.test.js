import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {database,USERS,asUser,createRequest} from '../support/database.js';
import {listRequests} from '../../src/features/workflow/service.js';
let db;
async function page(user,options={}){
 const input={own:false,query:'',status:'',category:'',sort:'newest',page:1,pageSize:25,summaryOnly:false,...options};
 return asUser(db,user,async tx=>(await tx.query('select m4_request_page($1,$2,$3,$4,$5,$6,$7,$8) result',Object.values(input))).rows[0].result);
}
test.before(async()=>{
 db=await database();
 await db.query(`insert into requests(title,description,location,requester_id,category_id,sensitive_information,created_at,target_at)
 select case when i=1 then 'Archive needle %_ literal' else 'Page fixture '||i end,
 'Fictional pagination record','Hall '||i,q.requester_id,c.category_id,false,
 '2026-01-01'::timestamptz+i*interval '1 second',case when i<=10 then '2026-01-02'::timestamptz end
 from generate_series(1,1250) i,requesters q,categories c
 where q.auth_user_id=$1 and c.name='Maintenance'`,[USERS.requester]);
 for(let i=0;i<5;i++)await createRequest(db,USERS.requester,true);
 for(let i=0;i<7;i++)await createRequest(db,USERS.other);
 await db.query(`insert into requests(title,description,location,requester_id,category_id,sensitive_information)
 select 'Other category','Fictional record','IT room',q.requester_id,c.category_id,false
 from generate_series(1,3),requesters q,categories c where q.auth_user_id=$1 and c.name='IT support'`,[USERS.requester]);
 await db.query(`update requests set status_id=(select status_id from statuses where name='Resolved') where title in ('Page fixture 2','Page fixture 3')`);
});
test.after(async()=>{await db?.close();});

test('PAGE01: all 1,258 owned records are reachable with stable pages and no other requester data',async()=>{
 const ids=[];
 for(let n=1;n<=13;n++){
  const result=await page(USERS.requester,{own:true,page:n,pageSize:100,sort:'oldest'});
  assert.equal(result.pagination.total,1258);assert.equal(result.pagination.pages,13);
  assert.equal(result.pagination.page,n);assert.ok(result.requests.length<=100);
  ids.push(...result.requests.map(r=>r.request_id));
 }
 assert.equal(ids.length,1258);assert.equal(new Set(ids).size,1258);
 const again=await page(USERS.requester,{own:true,pageSize:100,sort:'oldest'});
 assert.deepEqual(again.requests.map(r=>r.request_id),ids.slice(0,100));
 const other=await page(USERS.other,{own:true});assert.equal(other.pagination.total,7);
 assert.ok(other.requests.every(r=>!ids.includes(r.request_id)));
});
test('PAGE02: search finds an old request beyond the former 1,000-row window and treats wildcards literally',async()=>{
 for(const query of ['Archive needle','%_']){
  const result=await page(USERS.requester,{own:true,query});
  assert.equal(result.pagination.total,1);assert.equal(result.requests[0].title,'Archive needle %_ literal');
 }
 const reference=(await page(USERS.requester,{own:true,query:'Archive needle'})).requests[0].request_id;
 assert.equal((await page(USERS.requester,{own:true,query:reference.toUpperCase()})).pagination.total,1);
});
test('PAGE03: status, category and search are combined before paging, with complete matching totals',async()=>{
 const category=(await db.query("select category_id from categories where name='Maintenance'")).rows[0].category_id;
 const result=await page(USERS.requester,{own:true,status:'Resolved',category,query:'Page fixture',pageSize:1});
 assert.equal(result.pagination.total,2);assert.equal(result.requests.length,1);
 assert.equal(result.summary.total,2);assert.equal(result.summary.resolved,2);
 assert.deepEqual(result.summary.byStatus,{Resolved:2});
 assert.deepEqual(result.summary.byCategory,{Maintenance:2});
 assert.ok(result.categories.some(c=>c.name==='IT support'),'Category choices must survive filtering');
});
test('PAGE04: complete work totals exclude wrong-category and sensitive records regardless of ownership',async()=>{
 const manager=await page(USERS.manager,{summaryOnly:true});
 assert.deepEqual(manager.requests,[]);assert.equal(manager.summary.total,1257);
 assert.equal(manager.summary.resolved,2);assert.equal(manager.summary.open,1255);assert.equal(manager.summary.overdue,8);
 assert.deepEqual(manager.summary.byCategory,{Maintenance:1257});
 assert.ok(!manager.categories.some(c=>c.name==='IT support'));
 assert.equal((await page(USERS.staff,{summaryOnly:true})).summary.total,1262);
 assert.equal((await page(USERS.restricted,{summaryOnly:true})).summary.total,1257);
 const hidden=await page(USERS.manager,{query:'Other category'});assert.equal(hidden.summary.total,0);
 await db.query('insert into requesters(auth_user_id,full_name,email) values($1,$2,$3)',[USERS.manager,'Fictional manager requester','manager@example.test']);
 await db.query(`insert into requests(title,description,location,requester_id,category_id,sensitive_information)
  select 'Manager-owned outside work scope','Fictional record','IT room',q.requester_id,c.category_id,false
  from requesters q,categories c where q.auth_user_id=$1 and c.name='IT support'`,[USERS.manager]);
 assert.equal((await page(USERS.manager,{own:true})).summary.total,1);
 assert.equal((await page(USERS.manager,{summaryOnly:true})).summary.total,1257,'Ownership must not expand the work reporting scope');
});
test('PAGE05: anonymous, requester and admin cannot invoke a work list or aggregate',async()=>{
 for(const user of [null,USERS.requester,USERS.admin])await assert.rejects(page(user),e=>e.code==='42501');
});
test('PAGE06: empty sets, out-of-range pages, invalid paging and sort have bounded behaviour',async()=>{
 const empty=await page(USERS.manager,{query:'Nothing matches this fixture'});
 assert.deepEqual(empty.requests,[]);assert.equal(empty.pagination.total,0);assert.equal(empty.pagination.pages,1);
 const last=await page(USERS.requester,{own:true,page:999,pageSize:100});
 assert.equal(last.pagination.page,13);assert.equal(last.requests.length,58);
 for(const options of [{page:0},{pageSize:101},{pageSize:0},{sort:'invalid'},{query:'x'.repeat(201)}])
  await assert.rejects(page(USERS.requester,{own:true,...options}),e=>e.code==='22023');
});
test('PAGE07: API boundary forwards typed paging options and reports database failures safely',async()=>{
 let args;
 const client={auth:{getUser:async()=>({data:{user:{id:USERS.manager}}})},from(){const q={select(){return q;},eq(){return q;},maybeSingle:async()=>({data:{role:'manager'}})};return q;},rpc:async(name,input)=>{assert.equal(name,'m4_request_page');args=input;return {data:{requests:[],pagination:{total:0}}};}};
 await listRequests(client,{page:'2',pageSize:'50',query:'  needle  '});
 assert.equal(args.p_page,2);assert.equal(args.p_page_size,50);assert.equal(args.p_query,'needle');
 for(const options of [{page:'2abc'},{page:'-1'},{pageSize:'999'},{page:'1.5'},{own:'true'}])
  await assert.rejects(listRequests(client,options),e=>e.status===400);
 client.rpc=async()=>({error:{message:'Internal database detail'}});
 await assert.rejects(listRequests(client),e=>e.status===503&&!e.message.includes('Internal'));
});
test('PAGE08: migration preserves existing rows, access policies and audit history',async()=>{
 const old=await database({throughMigration:10});
 try{
  const request=await createRequest(old);
  const policies=(await old.query("select policyname,qual,with_check from pg_policies order by schemaname,tablename,policyname")).rows;
  const history=(await old.query('select * from status_history where request_id=$1',[request.request_id])).rows;
  await old.exec(await readFile(new URL('../../supabase/migrations/011_m4_request_pagination.sql',import.meta.url),'utf8'));
  assert.deepEqual((await old.query('select * from requests where request_id=$1',[request.request_id])).rows,[request]);
  assert.deepEqual((await old.query('select * from status_history where request_id=$1',[request.request_id])).rows,history);
  assert.deepEqual((await old.query("select policyname,qual,with_check from pg_policies order by schemaname,tablename,policyname")).rows,policies);
 }finally{await old.close();}
});
