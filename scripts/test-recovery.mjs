import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {join,resolve,sep} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {database,createRequest,rpc,asUser,USERS} from '../tests/support/database.js';
import {backupSimulation,restoreSimulation} from './simulation-backup.mjs';
const directory=await mkdtemp(join(tmpdir(),'civicconnect-recovery-'));
let source,restored;
try{
 source=await database();
 const request=await createRequest(source);
 await rpc(source,USERS.staff,request.request_id,1,'transition',{status:'Accepted'});
 await rpc(source,USERS.manager,request.request_id,2,'assign',{assignedTo:USERS.staff});
 await rpc(source,USERS.staff,request.request_id,3,'comment',{note:'Fictional private recovery note',visible:false});
 await rpc(source,USERS.manager,request.request_id,4,'assign',{assignedTo:USERS.restricted,note:'Fictional reassignment recovery reason',visible:false});
 const terminal=await createRequest(source);
 await rpc(source,USERS.staff,terminal.request_id,1,'transition',{status:'Rejected',note:'Fictional rejection'});
 await rpc(source,USERS.requester,terminal.request_id,2,'reopen',{note:'Fictional reopening request'});
 await source.query(`insert into requests(title,description,location,requester_id,category_id,sensitive_information)
 select 'Recovery workload '||i,'Fictional data','Test hall',q.requester_id,c.category_id,false
 from generate_series(1,998) i,requesters q,categories c where q.auth_user_id=$1 and c.name='Maintenance'`,[USERS.requester]);
 const key=`${request.request_id}/recovery.pdf`;const bytes=Buffer.from('%PDF-1.4\nFictional recovery attachment');
 await asUser(source,USERS.requester,tx=>tx.query('insert into storage.objects(bucket_id,name,owner_id) values($1,$2,$3)',['request-attachments',key,USERS.requester]));
 await asUser(source,USERS.requester,tx=>tx.query('select m3_link_attachment($1,$2)',[request.request_id,key]));
 const objects=new Map([[key,{bytes,type:'application/pdf'}]]);
 const configuration={applicationPort:3103,providerPort:54329,publicProviderUrl:'http://127.0.0.1:54329',environment:'fictional-local-simulation'};
 const tables=['requests','status_history','assignments','request_comments','requesters','service_members','service_scopes','categories','statuses','reopening_requests','storage.objects','storage.buckets','auth.users'];
 async function snapshot(db){const values={};for(const name of tables)values[name]=(await db.query(`select to_jsonb(t) row from ${name} t order by to_jsonb(t)::text`)).rows;return values;}
 const expected=await snapshot(source);
 const backup=await backupSimulation({db:source,objects,configuration,directory});
 // A post-backup mutation models data lost when recovering the earlier snapshot.
 const postBackup=await createRequest(source);const failureAt=new Date();
 await source.close();source=null;objects.clear();
 const started=performance.now();const recovery=await restoreSimulation(directory);restored=recovery.db;
 assert.deepEqual(await snapshot(restored),expected);
 assert.deepEqual(recovery.configuration,configuration);assert.deepEqual(recovery.objects.get(key).bytes,bytes);
 assert.equal(recovery.objects.get(key).type,'application/pdf');
 assert.equal((await restored.query('select * from requests where request_id=$1',[postBackup.request_id])).rows.length,0);
 assert.equal((await asUser(restored,USERS.other,tx=>tx.query('select * from requests where request_id=$1',[request.request_id]))).rows.length,0);
 assert.equal((await asUser(restored,USERS.requester,tx=>tx.query('select * from storage.objects where name=$1',[key]))).rows.length,1);
 assert.equal((await asUser(restored,USERS.requester,tx=>tx.query('select * from request_comments where request_id=$1',[request.request_id]))).rows.length,0);
 const version=(await restored.query('select version from requests where request_id=$1',[request.request_id])).rows[0].version;
 const assignmentHistory=(await asUser(restored,USERS.manager,tx=>tx.query('select * from m3_assignment_history($1)',[request.request_id]))).rows;
 assert.equal(assignmentHistory[0].reason,'Fictional reassignment recovery reason');
 assert.equal((await asUser(restored,USERS.requester,tx=>tx.query('select * from m3_assignment_history($1)',[request.request_id]))).rows[0].reason,null);
 await rpc(restored,USERS.restricted,request.request_id,version,'transition',{status:'In Progress'});
 const restoreMs=performance.now()-started;const lossWindowMs=failureAt.getTime()-Date.parse(backup.createdAt);
 // Ensure corrupted files are rejected before loading a database.
 const attachmentPath=join(directory,backup.files.attachments);await writeFile(attachmentPath,Buffer.concat([await readFile(attachmentPath),Buffer.from('corruption')]));
 await assert.rejects(restoreSimulation(directory),/integrity check failed/);
 const report={date:new Date().toISOString(),sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),workingTreeChanges:true,environment:'Controlled PGlite simulation recovery rehearsal; not hosted Supabase',seededRequestRows:1000,backupAt:backup.createdAt,failureAt:failureAt.toISOString(),restoreMs,restoreTargetMs:1800000,lossWindowMs,lossWindowTargetMs:86400000,restoredTables:tables,attachmentSha256:createHash('sha256').update(bytes).digest('hex'),assertions:['Exact backed-up table contents restored','Attachment bytes and type restored','Non-secret configuration restored','Post-backup data loss explicitly demonstrated','Requester isolation preserved','Attachment access policy preserved','Private comments remain hidden','Workflow continues after recovery','Corrupted archive rejected'],passed:restoreMs<=1800000&&lossWindowMs>=0&&lossWindowMs<=86400000,limitations:'Controlled 1,000-request snapshot and simulated failure only. No 24-hour scheduled-backup reliability, hosted storage/Auth recovery or production RPO claim.'};
 await mkdir('test-results',{recursive:true});await writeFile('test-results/recovery.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));assert.ok(report.passed);
}finally{
 await source?.close();await restored?.close();
 if(!resolve(directory).startsWith(resolve(tmpdir())+sep+'civicconnect-recovery-'))throw Error('Unsafe recovery cleanup path.');
 await rm(directory,{recursive:true,force:true});
}
