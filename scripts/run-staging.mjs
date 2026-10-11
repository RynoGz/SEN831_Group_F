import {spawn} from 'node:child_process';
const environment={...process.env,NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:54329',NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'local-simulation-publishable-key'};
const provider=spawn(process.execPath,['tests/support/provider.mjs'],{stdio:'inherit',env:environment});
const web=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3103'],{stdio:'inherit',env:environment});
let stopping=false;
function stop(code=0){if(stopping)return;stopping=true;provider.kill();web.kill();process.exitCode=code;}
provider.on('exit',code=>stop(code||0));web.on('exit',code=>stop(code||0));
process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());
console.log('Simulated staging: http://127.0.0.1:3103; fictional *@example.test accounts only.');
