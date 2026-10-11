import {spawnSync} from 'node:child_process';
import {mkdirSync,readdirSync} from 'node:fs';
const integration=process.argv[2]==='integration';const directory=integration?'tests/integration':'tests';const name=integration?'integration':'unit';
mkdirSync('test-results',{recursive:true});
const files=readdirSync(directory).filter(f=>f.endsWith('.test.js')).map(f=>`${directory}/${f}`);
const result=spawnSync(process.execPath,['--test','--test-reporter=spec','--test-reporter=junit','--test-reporter-destination=stdout',`--test-reporter-destination=test-results/${name}.xml`,...files],{stdio:'inherit'});
process.exitCode=result.status??1;
