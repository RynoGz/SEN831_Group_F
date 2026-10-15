import test from 'node:test';
import assert from 'node:assert/strict';
import {assignmentReasonError} from '../src/domain/requests/assignment-reason.js';

test('CR01: first assignment and unchanged assignee allow an omitted reason',()=>{
 assert.equal(assignmentReasonError(null,'staff',null),null);
 assert.equal(assignmentReasonError('staff','staff',''),null);
});
test('CR02: reassignment rejects missing and whitespace-only reasons',()=>{
 for(const note of [null,undefined,'',' ','\t\n','\u00a0','\ufeff'])assert.match(assignmentReasonError('staff','other',note),/Enter a reason/);
});
test('CR03: reason length boundary and malformed values are checked',()=>{
 assert.equal(assignmentReasonError('staff','other','a'.repeat(4000)),null);
 assert.match(assignmentReasonError('staff','other','a'.repeat(4001)),/4000/);
 assert.match(assignmentReasonError('staff','other',{}),/valid/);
});
