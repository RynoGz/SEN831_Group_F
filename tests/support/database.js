import {PGlite} from '@electric-sql/pglite';
import {readFile,readdir} from 'node:fs/promises';
export const USERS={
 perf:'77777777-7777-4777-8777-777777777777',
 requester:'11111111-1111-4111-8111-111111111111',
 other:'22222222-2222-4222-8222-222222222222',
 staff:'33333333-3333-4333-8333-333333333333',
 manager:'44444444-4444-4444-8444-444444444444',
 admin:'55555555-5555-4555-8555-555555555555',
 restricted:'66666666-6666-4666-8666-666666666666',
};
export async function database({throughMigration=Infinity}={}){
 const db=new PGlite();
 await db.exec(`create role anon; create role authenticated;
 create schema auth;create table auth.users(id uuid primary key,email text);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
create function auth.role() returns text language sql stable as $$select nullif(current_setting('request.jwt.claim.role',true),'')$$;
 grant usage on schema auth,public to anon,authenticated;
 grant execute on function auth.uid() to anon,authenticated;
 create schema storage;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text references storage.buckets(id),name text,owner_id text,unique(bucket_id,name));
 alter table storage.objects enable row level security;
 grant usage on schema storage to authenticated;
 grant select,insert,delete on storage.objects to authenticated;`);
 const dir=new URL('../../supabase/migrations/',import.meta.url);
 for(const file of (await readdir(dir)).filter(f=>f.endsWith('.sql')&&Number.parseInt(f,10)<=throughMigration).sort()){
  // PGlite lacks pgcrypto; these migrations use the PostgreSQL built-in UUID generator.
  const sql=(await readFile(new URL(file,dir),'utf8')).replace('create extension if not exists "pgcrypto";','');
  await db.exec(sql);
 }
 for(const [name,id] of Object.entries(USERS)) await db.query('insert into auth.users values($1,$2)',[id,`${name}@example.test`]);
 for(const name of ['requester','other','perf'])await db.query('insert into requesters(auth_user_id,full_name,email) values($1,$2,$3)',[USERS[name],`Fictional ${name}`,`${name}@example.test`]);
 for(const [name,role,clearance] of [['staff','staff',true],['manager','manager',false],['admin','admin',false],['restricted','staff',false]]){
  await db.query('insert into service_members values($1,$2,$3,$4)',[USERS[name],`Fictional ${name}`,role,clearance]);
  await db.query("insert into service_scopes select $1,category_id from categories where name='Maintenance'",[USERS[name]]);
 }
 return db;
}
export async function asUser(db,id,fn){
 return db.transaction(async tx=>{
  await tx.query("select set_config('request.jwt.claim.sub',$1,true)",[id??'']);
await tx.query("select set_config('request.jwt.claim.role',$1,true)",[id?'authenticated':'anon']);
  await tx.exec(id?'set local role authenticated':'set local role anon');
  return fn(tx);
 });
}
export async function createRequest(db,user=USERS.requester,sensitive=false){
 return asUser(db,user,async tx=>(await tx.query(`insert into requests(title,description,location,requester_id,category_id,sensitive_information)
 select 'Test tap','Fictional leak','Test hall',q.requester_id,c.category_id,$1
 from requesters q,categories c where q.auth_user_id=auth.uid() and c.name='Maintenance' returning *`,[sensitive])).rows[0]);
}
export async function rpc(db,user,id,version,operation,extras={}){
 return asUser(db,user,async tx=>(await tx.query('select m3_change_request($1,$2,$3,$4,$5,$6,$7,$8) result',[id,version,operation,extras.status??null,extras.assignedTo??null,extras.note??null,extras.visible??true,extras.targetAt??null])).rows[0].result);
}
