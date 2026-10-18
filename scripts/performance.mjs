// Run against the separate simulated staging stack, not against real user data.
import {writeFile,mkdir} from 'node:fs/promises';
const target='http://127.0.0.1:3103/api/my-requests';

const results=[];
const cookies=[];
for(const name of ['requester','other','perf']){
 const auth=await fetch('http://127.0.0.1:54329/auth/v1/token?grant_type=password',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:`${name}@example.test`,password:'Fictional-test-password-1!'})});
 const session=await auth.json();if(!auth.ok)throw Error('Simulation is not running.');
 cookies.push(`sb-127-auth-token=base64-${Buffer.from(JSON.stringify(session)).toString('base64url')}`);
}
for(const cookie of cookies)await fetch(target,{headers:{cookie}});
await Promise.all(cookies.map(async cookie=>{for(let i=0;i<20;i++){
 const start=performance.now();const response=await fetch(target,{headers:{cookie}});const body=await response.json();results.push({ms:performance.now()-start,status:response.status,records:body.requests?.length??0,matchingRecords:body.pagination?.total,pageSize:body.pagination?.pageSize});
}}));
const sorted=results.map(r=>r.ms).sort((a,b)=>a-b);
const report={environment:'Local production Next.js build + PostgreSQL-backed simulated Supabase; not hosted Supabase',operation:'Authenticated own-request page with complete matching totals',concurrentUsers:3,requests:60,seededDataRows:Number(process.env.TEST_SEED_COUNT||1000),recordsPerRead:results[0]?.records,matchingRecords:results[0]?.matchingRecords,pageSize:results[0]?.pageSize,duration:'20 sequential reads per worker after warmup',p95Ms:sorted[Math.ceil(sorted.length*.95)-1],errors:results.filter(r=>r.status!==200).length,targetMs:2000,interpretation:'Small local paginated-read regression with three identities. Not directly equivalent to historical unpaginated reads; does not establish cloud latency, sustained production capacity, submission response time or recovery.'};
report.passed=report.errors===0&&report.p95Ms<=report.targetMs;
await mkdir('test-results',{recursive:true});await writeFile('test-results/performance.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.passed)process.exitCode=1;
