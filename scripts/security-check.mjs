import {readdir,readFile} from 'node:fs/promises';
const problems=[];
async function scan(path){for(const entry of await readdir(path,{withFileTypes:true})){
 const file=`${path}/${entry.name}`;if(entry.isDirectory()){await scan(file);continue;}
 const text=await readFile(file,'utf8');
 if(/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text)||/\b(?:sb_secret_[A-Za-z0-9_-]{16,}|AKIA[A-Z0-9]{16})\b/.test(text))problems.push(file);
 if(/NEXT_PUBLIC_[A-Z_]*(?:SERVICE_ROLE|SECRET)/.test(text))problems.push(`${file}: privileged public variable`);
}}
await scan('src');await scan('supabase');
if(problems.length){console.error('Potential secret exposure:',problems);process.exitCode=1;}else console.log('Source/migration secret-pattern check passed. This is a bounded heuristic, not a security certification.');
