import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,copyFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const require=createRequire(process.cwd()+'/package.json');
const {chromium,expect:baseExpect}=require('@playwright/test');
const expect=baseExpect.configure({timeout:30000}),baseURL='http://127.0.0.1:3104';
const out=new URL('./hosted-performance-results.json',import.meta.url),initial=new URL('./hosted-performance-initial-results.json',import.meta.url);
copyFileSync(out,initial);const report=JSON.parse(readFileSync(out,'utf8'));
report.followupStartedAt=new Date().toISOString();report.reads=report.reads.filter(x=>x.operation!=='details');report.interactions=[];delete report.error;
report.verificationFinding='Initial strict Status label selector included option text; follow-up uses the existing filter form selects. Original raw failure and pre-optimisation detail timings retained separately.';
report.performanceCorrection='After authorising the parent request, independent read-only detail queries run concurrently. Only affected detail measurements and UI interactions rerun; original list/submission samples retained.';
const browser=await chromium.launch({headless:true}),actors=[];
function save(){writeFileSync(out,JSON.stringify(report,null,2));}
function stats(values,target){const a=values.map(x=>x.ms).sort((x,y)=>x-y);return {samples:a.length,p95Ms:a[Math.ceil(a.length*.95)-1],maxMs:a.at(-1),errors:values.filter(x=>!x.ok).length,targetMs:target,passed:values.length>0&&values.every(x=>x.ok)&&a[Math.ceil(a.length*.95)-1]<=target};}
try{
 for(const role of ['requester','other','manager']){const context=await browser.newContext({baseURL});const page=await context.newPage();page.setDefaultTimeout(30000);await page.goto('/auth/login');await page.getByLabel('Email',{exact:true}).fill(role+'@example.test');await page.getByLabel('Password',{exact:true}).fill('Fictional-test-password-1!');await page.getByRole('button',{name:'Sign in',exact:true}).click();await expect(page).toHaveURL(/\/(requests|management)$/);const endpoint=role==='manager'?'/api/work':'/api/my-requests';const r=await page.request.get(endpoint);assert.equal(r.status(),200);const rows=(await r.json()).requests;actors.push({role,page,context,detail:'/api/requests/'+rows[0].request_id});}
 await Promise.all(actors.map(async a=>{for(let i=0;i<5;i++){const start=performance.now();try{const r=await a.page.request.get(a.detail,{timeout:15000});const b=await r.json();report.reads.push({role:a.role,operation:'details',ms:performance.now()-start,status:r.status(),ok:r.status()===200&&!!b.request});}catch(e){report.reads.push({role:a.role,operation:'details',ms:performance.now()-start,ok:false,error:e.name});}save();}}));
 console.log('Completed 15 optimised hosted detail reads');
 for(const a of actors){await a.page.goto(a.role==='manager'?'/work':'/requests');await expect(a.page.getByRole('searchbox')).toBeVisible();const status=a.page.locator('form.filters select').nth(0),sort=a.page.locator('form.filters select').nth(2);
  for(let i=0;i<5;i++){
   let start=performance.now();await a.page.getByRole('searchbox').fill(i%2?'':'Hosted performance');await expect(a.page.getByRole('searchbox')).toHaveValue(i%2?'':'Hosted performance');await a.page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));report.interactions.push({role:a.role,operation:'search',ms:performance.now()-start,ok:true});
   start=performance.now();await status.selectOption('Submitted');await expect(status).toHaveValue('Submitted');await a.page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));report.interactions.push({role:a.role,operation:'filter',ms:performance.now()-start,ok:true});
   start=performance.now();await sort.selectOption(i%2?'newest':'oldest');await expect(sort).toHaveValue(i%2?'newest':'oldest');await a.page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));report.interactions.push({role:a.role,operation:'sort',ms:performance.now()-start,ok:true});
  }save();
 }
 console.log('Completed 45 hosted browser search/filter/sort interactions');
 const manager=actors.find(a=>a.role==='manager');report.fixtureCleanup=[];
 for(const href of report.fixturePaths){const api=href.replace('/requests/','/api/requests/');const d=await (await manager.page.request.get(api)).json();const r=await manager.page.request.patch(api,{headers:{origin:baseURL},data:{version:d.request.version,operation:'transition',status:'Rejected',note:'Fictional performance verification complete; no real service work required'}});report.fixtureCleanup.push({path:href,status:r.status(),terminal:r.status()===200});save();}
 const before=await (await manager.page.request.get(manager.detail)).json();
 const conflict=await manager.page.request.patch(manager.detail,{headers:{origin:baseURL},data:{version:before.request.version-1,operation:'comment',note:'Stale performance follow-up must not persist'},timeout:10000});assert.equal(conflict.status(),409);assert.equal((await conflict.json()).error,'This request has changed. Reload it and try again.');assert.deepEqual(await (await manager.page.request.get(manager.detail)).json(),before);report.staleConflictRegression='Passed HTTP 409, reload message and unchanged state through production Next.js and hosted Supabase';
 report.summary={};for(const operation of ['own-list','management-data','details'])report.summary[operation]=stats(report.reads.filter(x=>x.operation===operation),2000);for(const operation of ['search','filter','sort'])report.summary[operation]=stats(report.interactions.filter(x=>x.operation===operation),2000);report.summary.submission=stats(report.submissions,3000);report.passed=Object.values(report.summary).every(x=>x.passed);console.log(JSON.stringify(report.summary,null,2));
}catch(e){report.error={name:e.name,message:e.message.slice(0,1500)};report.passed=false;console.log('ERROR '+e.message.slice(0,400));process.exitCode=1;}
finally{report.completedAt=new Date().toISOString();save();for(const a of actors)await a.context.close();await browser.close();}
