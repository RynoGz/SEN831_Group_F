// Loopback-only Supabase HTTP simulation backed by the actual PostgreSQL migrations.
// Does not emulate hosted Auth cryptography, PostgREST completely, or cloud storage.
import {createServer} from 'node:http';
import {database,USERS,asUser} from './database.js';
const db=await database();const objects=new Map();
const seedCount=Number(process.env.TEST_SEED_COUNT||0);
if(seedCount){
 await db.query(`insert into requests(title,description,location,requester_id,category_id,sensitive_information)
 select 'Performance fixture '||i,'Fictional workload data','Test hall',
 (select requester_id from requesters where auth_user_id=case i%3 when 0 then $1::uuid when 1 then $2::uuid else $3::uuid end),
 (select category_id from categories where name='Maintenance'),false from generate_series(1,$4) i`,[USERS.requester,USERS.other,USERS.perf,seedCount]);
}
const port=Number(process.env.TEST_PROVIDER_PORT||54329);
const tokens=new Map();const refresh=new Map();
function authUser(name){return {id:USERS[name],aud:'authenticated',role:'authenticated',email:`${name}@example.test`,app_metadata:{provider:'email'},user_metadata:{},created_at:'2026-10-08T00:00:00Z'};}
function token(name){const user=authUser(name);const exp=Math.floor(Date.now()/1000)+3600;
 const access=[{alg:'HS256',typ:'JWT'},{sub:user.id,role:'authenticated',aud:'authenticated',exp,iss:`http://127.0.0.1:${port}/auth/v1`}].map(v=>Buffer.from(JSON.stringify(v)).toString('base64url')).join('.')+'.local-simulation';
 const renewal=crypto.randomUUID();tokens.set(access,user.id);refresh.set(renewal,name);
 return {access_token:access,token_type:'bearer',expires_in:3600,expires_at:exp,refresh_token:renewal,user};
}
const identifier=s=>{if(!/^[a-z_][a-z0-9_]*$/.test(s))throw Error('Invalid identifier');return `"${s}"`;};
const server=createServer(async(req,res)=>{
 res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:3103');res.setHeader('Access-Control-Allow-Headers','authorization,apikey,content-type,x-client-info,x-supabase-api-version');res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,OPTIONS');
 function send(status,data){res.statusCode=status;if(data===undefined){res.end();return;}res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));}
 if(req.method==='OPTIONS'){send(204);return;}
 const url=new URL(req.url,`http://127.0.0.1:${port}`);const buffers=[];for await(const part of req)buffers.push(part);const bytes=Buffer.concat(buffers);
 const user=tokens.get(req.headers.authorization?.replace(/^Bearer /i,''));
 let body;try{body=bytes.length&&String(req.headers['content-type']).includes('json')?JSON.parse(bytes):{};}catch{send(400,{message:'Invalid JSON'});return;}
 try{
 if(url.pathname==='/health'){send(200,{ready:true,simulation:true});return;}
 if(url.pathname==='/auth/v1/token'){
  const name=url.searchParams.get('grant_type')==='refresh_token'?refresh.get(body.refresh_token):Object.keys(USERS).find(n=>body.email===`${n}@example.test`&&body.password==='Fictional-test-password-1!');
  if(!name){send(400,{msg:'Invalid login credentials',code:'invalid_credentials'});return;}send(200,token(name));return;
 }
 if(url.pathname==='/auth/v1/user'){if(!user){send(401,{msg:'Not authenticated'});return;}const name=Object.keys(USERS).find(k=>USERS[k]===user);send(200,authUser(name));return;}
 if(url.pathname==='/auth/v1/logout'){tokens.delete(req.headers.authorization?.replace(/^Bearer /i,''));send(204);return;}
 if(url.pathname.startsWith('/rest/v1/rpc/')){
  const fn=url.pathname.split('/').pop();if(!['m3_change_request','m3_staff_directory','m3_is_owner','m3_can_work','m3_link_attachment'].includes(fn))throw Error('Unknown RPC');
  const keys=Object.keys(body);const args=keys.map((k,i)=>`${identifier(k)}=>$${i+1}`).join(',');
  const result=await asUser(db,user,tx=>tx.query(fn==='m3_staff_directory'?`select * from ${identifier(fn)}(${args})`:`select ${identifier(fn)}(${args}) result`,Object.values(body)));
  send(200,fn==='m3_staff_directory'?result.rows:result.rows[0].result);return;
 }
 if(url.pathname.startsWith('/rest/v1/')){
  const table=url.pathname.split('/').pop();if(!['requests','requesters','categories','statuses','status_history','service_members','service_scopes','request_comments','assignments','reopening_requests'].includes(table))throw Error('Unknown table');
  const selected=url.searchParams.get('select')||'*';let result;
  if(req.method==='POST'){
   const keys=Object.keys(body);result=await asUser(db,user,tx=>tx.query(`insert into ${identifier(table)}(${keys.map(identifier).join(',')}) values(${keys.map((_,i)=>'$'+(i+1)).join(',')}) returning *`,Object.values(body)));
  }else if(req.method==='GET'){
   const values=[];const filters=[];
   for(const [key,value] of url.searchParams){if(['select','order','limit'].includes(key))continue;
    if(!value.startsWith('eq.'))throw Error('Unsupported simulated filter');values.push(value.slice(3));filters.push(`t.${identifier(key)}=$${values.length}`);
   }
   let columns='t.*';
   if(selected.includes('categories('))columns+=', (select jsonb_build_object(\'name\',c.name) from categories c where c.category_id=t.category_id) categories';
   if(selected.includes('statuses('))columns+=', (select jsonb_build_object(\'name\',s.name) from statuses s where s.status_id=t.status_id) statuses';
   const order=url.searchParams.get('order');const sort=order?` order by t.${identifier(order.split('.')[0])} ${order.includes('.desc')?'desc':'asc'}`:'';
   const limit=Math.min(Number(url.searchParams.get('limit')||10000),10000);
   result=await asUser(db,user,tx=>tx.query(`select ${columns} from ${identifier(table)} t${filters.length?' where '+filters.join(' and '):''}${sort} limit ${Number.isFinite(limit)?limit:1000}`,values));
  }else{send(405,{message:'Unsupported operation'});return;}
  if(String(req.headers.accept).includes('vnd.pgrst.object+json')){if(result.rows.length!==1){send(406,{code:'PGRST116',message:'Expected one row'});return;}send(200,result.rows[0]);}
  else send(200,result.rows);
  return;
 }
 if(url.pathname.startsWith('/storage/v1/object/')){
  let path=url.pathname.slice('/storage/v1/object/'.length);if(path.startsWith('authenticated/'))path=path.slice('authenticated/'.length);
  const [bucket,...parts]=path.split('/');const key=decodeURIComponent(parts.join('/'));
  if(req.method==='POST'){
   await asUser(db,user,tx=>tx.query('insert into storage.objects(bucket_id,name,owner_id) values($1,$2,$3)',[bucket,key,user]));
   objects.set(key,{bytes,type:req.headers['content-type']});send(200,{Key:`${bucket}/${key}`});return;
  }
  if(req.method==='GET'){
   const access=await asUser(db,user,tx=>tx.query('select name from storage.objects where bucket_id=$1 and name=$2',[bucket,key]));
   if(!access.rows.length||!objects.has(key)){send(404,{message:'Object unavailable'});return;}
   res.setHeader('Content-Type',objects.get(key).type);res.end(objects.get(key).bytes);return;
  }
  if(req.method==='DELETE'){
   const removed=[];for(const k of body.prefixes??[]){const deleted=await asUser(db,user,tx=>tx.query('delete from storage.objects where bucket_id=$1 and name=$2 returning name',[bucket,k]));if(deleted.rows.length){objects.delete(k);removed.push({name:k});}}
   send(200,removed);return;
  }
 }
 send(404,{message:'Not found'});
 }catch(error){send(error.code==='42501'?403:400,{message:error.message,code:error.code??'SIMULATION_ERROR'});}
});
server.listen(port,'127.0.0.1',()=>console.log(`PostgreSQL-backed simulated provider ready on ${port}`));
async function stop(){server.close();await db.close();process.exit(0);}
process.on('SIGTERM',stop);process.on('SIGINT',stop);
