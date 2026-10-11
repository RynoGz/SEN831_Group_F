import test from 'node:test';
import assert from 'node:assert/strict';
import {isOverdue,summarize} from '../src/domain/requests/reporting.js';
import {inspectAttachment,uploadAttachment,MAX_ATTACHMENT_BYTES} from '../src/features/attachments/attachment-store.js';
const row=(status,target)=>({statuses:{name:status},categories:{name:'Maintenance'},target_at:target});
test('BB01 FR-014 BVA: overdue before/equal/after deadline',()=>{
 const target='2026-10-08T10:00:00Z';const t=Date.parse(target);
 assert.equal(isOverdue(row('Accepted',target),t-1),false);assert.equal(isOverdue(row('Accepted',target),t),false);assert.equal(isOverdue(row('Accepted',target),t+1),true);
});
test('BB02 FR-014 decision table: terminal states excluded even after deadline',()=>{
 for(const status of ['Resolved','Closed','Rejected'])assert.equal(isOverdue(row(status,'2020-01-01'),Date.now()),false);
 assert.equal(isOverdue(row('Submitted',null)),false);
});
test('BB03 FR-015: aggregate scope supplied by authorised query',()=>{
 const r=summarize([row('Submitted','2020-01-01'),row('Closed',null),row('Resolved',null)]);
 assert.equal(r.total,3);assert.equal(r.open,1);assert.equal(r.overdue,1);assert.equal(r.closed,1);assert.equal(r.resolved,1);assert.equal(r.byCategory.Maintenance,3);
});
test('BB04 attachment BVA: reject empty and oversized; accept exact size',()=>{
 assert.throws(()=>inspectAttachment(new Uint8Array(0),'application/pdf'),/nonempty/);
 assert.throws(()=>inspectAttachment(new Uint8Array(MAX_ATTACHMENT_BYTES+1),'application/pdf'),/5 MiB/);
 const bytes=new Uint8Array(MAX_ATTACHMENT_BYTES);bytes.set(new TextEncoder().encode('%PDF-'));
 assert.equal(inspectAttachment(bytes,'application/pdf'),'pdf');
});
test('BB05 attachment EP: declared type must match signature',()=>{
 assert.throws(()=>inspectAttachment(new TextEncoder().encode('not a PDF'),'application/pdf'),/signature/);
 assert.throws(()=>inspectAttachment(new TextEncoder().encode('%PDF-'),'text/plain'),/signature/);
 assert.equal(inspectAttachment(new Uint8Array([255,216,255,0]),'image/jpeg'),'jpg');
});
test('ATT01: database link failure removes staged file',async()=>{
 let deleted=false;
 await assert.rejects(uploadAttachment({store:{upload:async()=>{},remove:async()=>{deleted=true;}},client:{rpc:async()=>({error:{message:'failure'}})},requestId:'id',key:'key',bytes:[],type:'application/pdf'}),/staged upload was removed/);
 assert.equal(deleted,true);
});
test('ATT02: cleanup failure reported rather than claiming success',async()=>{
 await assert.rejects(uploadAttachment({store:{upload:async()=>{},remove:async()=>{throw Error();}},client:{rpc:async()=>({error:{}})},requestId:'id',key:'key',bytes:[],type:'application/pdf'}),/cleanup could not be confirmed/);
});
