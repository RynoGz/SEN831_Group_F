import test from 'node:test';
import assert from 'node:assert/strict';
import {isOverdue} from '../src/domain/requests/reporting.js';
import {attachmentStore,inspectAttachment,uploadAttachment,readAttachmentFile,MAX_ATTACHMENT_BYTES} from '../src/features/attachments/attachment-store.js';
const row=(status,target)=>({statuses:{name:status},categories:{name:'Maintenance'},target_at:target});
test('BB01 FR-014 BVA: overdue before/equal/after deadline',()=>{
 const target='2026-10-08T10:00:00Z';const t=Date.parse(target);
 assert.equal(isOverdue(row('Accepted',target),t-1),false);assert.equal(isOverdue(row('Accepted',target),t),false);assert.equal(isOverdue(row('Accepted',target),t+1),true);
});
test('BB02 FR-014 decision table: terminal states excluded even after deadline',()=>{
 for(const status of ['Resolved','Closed','Rejected'])assert.equal(isOverdue(row(status,'2020-01-01'),Date.now()),false);
 assert.equal(isOverdue(row('Submitted',null)),false);
});
test('BB04 attachment BVA: reject empty and oversized; accept exact size',()=>{
 assert.throws(()=>inspectAttachment(new Uint8Array(0),'application/pdf'),/nonempty/);
 assert.equal(MAX_ATTACHMENT_BYTES,4194304);
 assert.throws(()=>inspectAttachment(new Uint8Array(MAX_ATTACHMENT_BYTES+1),'application/pdf'),/4 MiB/);
 const bytes=new Uint8Array(MAX_ATTACHMENT_BYTES);bytes.set(new TextEncoder().encode('%PDF-'));
 assert.equal(inspectAttachment(bytes,'application/pdf'),'pdf');
});
test('BB05 attachment EP: declared type must match signature',()=>{
 assert.throws(()=>inspectAttachment(new TextEncoder().encode('not a PDF'),'application/pdf'),/signature/);
 assert.throws(()=>inspectAttachment(new TextEncoder().encode('%PDF-'),'text/plain'),/signature/);
 assert.equal(inspectAttachment(new Uint8Array([255,216,255,0]),'image/jpeg'),'jpg');
 assert.equal(inspectAttachment(new Uint8Array([137,80,78,71,13,10,26,10]),'image/png'),'png');
 assert.throws(()=>inspectAttachment(new Uint8Array([255,216,255,0]),'image/png'),/signature/);
});
test('ATT01: database link failure removes staged file',async()=>{
 let deleted=false;
 await assert.rejects(uploadAttachment({store:{upload:async()=>{},remove:async()=>{deleted=true;}},client:{rpc:async()=>({error:{message:'failure'}})},requestId:'id',key:'key',bytes:[],type:'application/pdf'}),/staged upload was removed/);
 assert.equal(deleted,true);
});
test('ATT02: cleanup failure reported rather than claiming success',async()=>{
 await assert.rejects(uploadAttachment({store:{upload:async()=>{},remove:async()=>{throw Error();}},client:{rpc:async()=>({error:{}})},requestId:'id',key:'key',bytes:[],type:'application/pdf'}),/cleanup could not be confirmed/);
});

function uploadRequest(size){
 const form=new FormData();form.set('file',new File([new Uint8Array(size)],'fixture.pdf',{type:'application/pdf'}));
 return new Request('http://localhost/upload',{method:'POST',body:form});
}
test('ATT03: multipart accepts exactly 4 MiB and rejects one byte over, empty and missing files',async()=>{
 assert.equal((await readAttachmentFile(uploadRequest(MAX_ATTACHMENT_BYTES))).size,MAX_ATTACHMENT_BYTES);
 await assert.rejects(readAttachmentFile(uploadRequest(MAX_ATTACHMENT_BYTES+1)),e=>e.status===413&&/4 MiB/.test(e.message));
 await assert.rejects(readAttachmentFile(uploadRequest(0)),e=>e.status===400&&/nonempty/.test(e.message));
 await assert.rejects(readAttachmentFile(new Request('http://localhost/upload',{method:'POST',body:new FormData()})),/Choose a file/);
});
test('ATT04: actual streamed body is bounded even without an honest content-length',async()=>{
 let cancelled=false;
 const body=new ReadableStream({start(controller){controller.enqueue(new Uint8Array(MAX_ATTACHMENT_BYTES+65537));},cancel(){cancelled=true;}});
 const request=new Request('http://localhost/upload',{method:'POST',body,duplex:'half',headers:{'content-length':'1','content-type':'multipart/form-data; boundary=test'}});
 await assert.rejects(readAttachmentFile(request),e=>e.status===413);
 assert.equal(cancelled,true);
 const declared=uploadRequest(1);declared.headers.set('content-length',String(MAX_ATTACHMENT_BYTES+65537));
 await assert.rejects(readAttachmentFile(declared),e=>e.status===413);
 await assert.rejects(readAttachmentFile(new Request('http://localhost/upload',{method:'POST',body:'bad multipart',headers:{'content-type':'multipart/form-data; boundary=missing'}})),e=>e.status===400);
});
test('ATT05: thrown link failure cleans staged storage without exposing the underlying error',async()=>{
 let removed=false;
 await assert.rejects(uploadAttachment({store:{upload:async()=>{},remove:async()=>{removed=true;}},client:{rpc:async()=>{throw Error('private transport details');}},requestId:'id',key:'key',bytes:[],type:'application/pdf'}),/staged upload was removed/);
 assert.equal(removed,true);
});
test('ATT06: failed upload never links and failed cleanup never claims removal',async()=>{
 let linked=false;
 await assert.rejects(uploadAttachment({store:{upload:async()=>{throw Error('Upload failed');}},client:{rpc:async()=>{linked=true;}},requestId:'id',key:'key',bytes:[],type:'application/pdf'}),/Upload failed/);
 assert.equal(linked,false);
 const store=attachmentStore({storage:{from:()=>({remove:async()=>({data:[],error:null})})}});
 await assert.rejects(store.remove('key'),/Cleanup failed/);
});
test('ATT07: legacy 5 MiB object download remains byte-for-byte available through the private adapter',async()=>{
 const blob=new Blob([new Uint8Array(5*1024*1024)],{type:'application/pdf'});
 const store=attachmentStore({storage:{from:bucket=>{assert.equal(bucket,'request-attachments');return {download:async key=>{assert.equal(key,'request/legacy.pdf');return {data:blob,error:null};}};}}});
 assert.equal(await store.download('request/legacy.pdf'),blob);
});
