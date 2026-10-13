// Local simulation only. Call while request processing is paused so DB and objects agree.
import {mkdir,writeFile,readFile,rename} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {PGlite} from '@electric-sql/pglite';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export async function backupSimulation({db,objects,configuration,directory}){
 const id=randomUUID();const createdAt=new Date().toISOString();await mkdir(directory,{recursive:true});
 const database=Buffer.from(await (await db.dumpDataDir('gzip')).arrayBuffer());
 const attachments=Buffer.from(JSON.stringify([...objects].map(([key,value])=>[key,{type:value.type,bytes:Buffer.from(value.bytes).toString('base64')}])));
 const config=Buffer.from(JSON.stringify(configuration));
 const manifest={format:1,createdAt,engine:'PGlite',files:{database:`${id}.database.tgz`,attachments:`${id}.attachments.json`,configuration:`${id}.configuration.json`},sha256:{database:hash(database),attachments:hash(attachments),configuration:hash(config)}};
 for(const [name,bytes] of [['database',database],['attachments',attachments],['configuration',config]])await writeFile(join(directory,manifest.files[name]),bytes,{flag:'wx'});
 const temporary=join(directory,`${id}.manifest.json`);
 await writeFile(temporary,JSON.stringify(manifest,null,2),{flag:'wx'});
 await rename(temporary,join(directory,'latest.json'));
 return manifest;
}
export async function restoreSimulation(directory){
 const manifest=JSON.parse(await readFile(join(directory,'latest.json'),'utf8'));
 if(manifest.format!==1||manifest.engine!=='PGlite')throw Error('Unsupported simulation backup.');
 const files={};
 for(const name of ['database','attachments','configuration']){
  const filename=manifest.files?.[name];
  if(typeof filename!=='string'||!/^[-a-z0-9]+\.(database\.tgz|attachments\.json|configuration\.json)$/.test(filename))throw Error('Invalid backup filename.');
  files[name]=await readFile(join(directory,filename));
  if(hash(files[name])!==manifest.sha256[name])throw Error('Backup integrity check failed.');
 }
 const entries=JSON.parse(files.attachments);
 const objects=new Map(entries.map(([key,value])=>[key,{type:value.type,bytes:Buffer.from(value.bytes,'base64')}]));
 const configuration=JSON.parse(files.configuration);
 const db=await PGlite.create({loadDataDir:new Blob([files.database])});
 return {db,objects,configuration,manifest};
}
