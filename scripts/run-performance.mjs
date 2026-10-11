import {spawn} from 'node:child_process';
const env={...process.env,TEST_SEED_COUNT:'1000',NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:54329',NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'local-simulation-publishable-key'};
const children=[];
function start(args){const child=spawn(process.execPath,args,{env,stdio:'inherit'});children.push(child);return child;}
async function wait(url){const started=Date.now();while(Date.now()-started<60000){try{if((await fetch(url)).ok)return;}catch{}await new Promise(resolve=>setTimeout(resolve,250));}throw Error('Staging did not start');}
try{
 start(['tests/support/provider.mjs']);await wait('http://127.0.0.1:54329/health');
 start(['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3103']);await wait('http://127.0.0.1:3103');
 const test=start(['scripts/performance.mjs']);process.exitCode=await new Promise(resolve=>test.on('exit',code=>resolve(code??1)));
}finally{for(const child of children)child.kill();}
