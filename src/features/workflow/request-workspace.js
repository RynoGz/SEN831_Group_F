"use client";
import Link from 'next/link';
import {useRef,useState} from 'react';
import {readApiResponse} from './api-response';
import {useApi,ApiState,displayTime} from './use-api';
import {canTransition,REQUEST_STATUSES} from '@/domain/requests/request-transition-policy';
import {isOverdue} from '@/domain/requests/reporting';
import AttachmentUpload from './attachment-upload';
import StatusBadge from '@/components/status-badge';
import Textarea from '@/components/textarea';
import {assignmentReasonError} from '@/domain/requests/assignment-reason';
export default function RequestWorkspace({requestId}){
 const state=useApi(`/api/requests/${requestId}`);
 const managerDirectory=state.data?.actor.role==='manager'&&state.data.actor.canWork;
 const directory=useApi(managerDirectory?`/api/staff-directory?requestId=${encodeURIComponent(requestId)}`:null);
 const [pending,setPending]=useState(false);const [message,setMessage]=useState('');
 const [failed,setFailed]=useState(false);const [conflict,setConflict]=useState(false);const inFlight=useRef(false);
 const [assignmentSelection,setAssignmentSelection]=useState(null);const [assignmentError,setAssignmentError]=useState('');
 async function change(event){event.preventDefault();if(inFlight.current||state.loading)return;const formElement=event.currentTarget;const form=new FormData(formElement);
  if(form.get('operation')==='assign'){
   if(state.data.actor.role==='manager'&&(directory.loading||directory.error||!Array.isArray(directory.data?.staff)||!directory.data.staff.some(member=>member?.user_id===form.get('assignedTo'))))return;
   const error=assignmentReasonError(state.data.assignments[0]?.assigned_to,form.get('assignedTo'),form.get('note'));
   setAssignmentError(error??'');
   if(error){formElement.querySelector('[name="note"]').focus();return;}
  }
  if(!formElement.reportValidity())return;
  inFlight.current=true;setPending(true);setMessage('');setFailed(false);setConflict(false);
  const target=form.get('targetAt');
  try{const response=await fetch(`/api/requests/${requestId}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({version:state.data.request.version,operation:form.get('operation'),status:form.get('status')||null,assignedTo:form.get('assignedTo')||null,note:form.get('note')||null,visible:form.get('visible')!=='private',targetAt:target?new Date(target).toISOString():null})});
   const result=await readApiResponse(response);if(result?.id!==requestId||!Number.isInteger(result.version))throw new Error('The update could not be confirmed. Reload the request before trying again.');setMessage('Update saved.');if(form.get('operation')==='assign'){formElement.reset();setAssignmentSelection(null);setAssignmentError('');}state.reload();
  }catch(e){setFailed(true);setConflict(e.status===409);setMessage(e.message||'The update failed.');}finally{inFlight.current=false;setPending(false);}
 }
 if(!state.data)return <ApiState state={state}/>;
 const {request:r,history,comments,assignments,reopenings,actor}=state.data;const status=r.statuses?.name;
 const operational=actor.canWork&&['staff','manager'].includes(actor.role);const terminal=['Closed','Rejected'].includes(status);
 const nextStatuses=REQUEST_STATUSES.filter(s=>canTransition(status,s)&&s!=='Assigned'&&(actor.role==='manager'||(status==='Submitted'||(assignments[0]?.assigned_to===actor.id&&s!=='Closed'))));
 const directoryValid=Array.isArray(directory.data?.staff)&&directory.data.staff.every(member=>member&&typeof member.user_id==='string'&&member.user_id.trim()&&typeof member.display_name==='string'&&member.display_name.trim());
 const staff=directoryValid?directory.data.staff:[];
 const directoryInvalid=managerDirectory&&!directory.loading&&!directory.error&&!directoryValid;
 const busy=pending||state.loading;
 const directoryUnavailable=managerDirectory&&(directory.loading||Boolean(directory.error)||directoryInvalid||staff.length===0);
 const assignee=assignments[0]?.assigned_to;
 const preferredAssignee=assignmentSelection??assignee;
 const selectedAssignee=actor.role==='staff'?actor.id:staff.some(member=>member.user_id===preferredAssignee)?preferredAssignee:'';
 const isReassignment=Boolean(assignee&&selectedAssignee&&selectedAssignee!==assignee);
 const assigneeName=staff.find(member=>member.user_id===assignee)?.display_name??(assignee===actor.id?actor.name:assignee??'Unassigned');
 return <><div className="back-links"><Link href="/requests">Back to my requests</Link>{operational&&<Link href="/work">Back to work queue</Link>}</div>
 <div className="page-heading detail-heading"><div><p className="eyebrow">Request …{r.request_id.slice(-8)}</p><h1>{r.title}</h1><p className="small">Submitted {displayTime(r.created_at)}</p></div><StatusBadge status={status} overdue={isOverdue(r)}/></div>
 <ApiState state={state}/>
 <p className="workflow-message" role={failed?'alert':'status'}>{message}</p>
 {conflict&&<button className="nav-button" type="button" onClick={()=>{setConflict(false);setFailed(false);setMessage('');state.reload();}}>Reload request</button>}
 <div className="content-columns"><div><section className="panel detail-panel"><div className="panel-content"><span className="status-badge status-submitted">{r.categories?.name}</span><span className="small" style={{marginLeft:12}}>{r.sensitive_information?'Sensitive':'Not sensitive'}</span><h2 style={{marginTop:22}}>The issue</h2><p className="preserve-lines">{r.description}</p><h3>Attachment</h3>
 {r.attachment_reference?<a className="text-link" href={`/api/requests/${r.request_id}/attachment`}>Download private attachment</a>:actor.ownsRequest?<AttachmentUpload requestId={r.request_id} onSaved={state.reload}/>:<p className="small">No attachment.</p>}</div>
 <dl className="details-grid"><div><dt>Reference</dt><dd>{r.request_id}</dd></div><div><dt>Category</dt><dd>{r.categories?.name}</dd></div><div><dt>Location</dt><dd>{r.location}</dd></div><div><dt>Submitted</dt><dd>{displayTime(r.created_at)}</dd></div><div><dt>Target</dt><dd>{displayTime(r.target_at)}</dd></div><div><dt>Sensitive</dt><dd>{r.sensitive_information?'Yes':'No'}</dd></div><div><dt>Assigned user</dt><dd>{assigneeName}</dd></div></dl></section>
 <section className="panel"><h2>Updates and comments</h2>{comments.length===0?<p>No updates yet.</p>:comments.map(c=><article className="comment" key={c.comment_id}><p className="preserve-lines">{c.body}</p><p className="small">{c.requester_visible?'Requester-visible':'Internal'} · {displayTime(c.created_at)} · {c.author_id}</p></article>)}</section>
 <section className="panel"><h2>Assignment history</h2>{assignments.length===0?<p>No assignments yet.</p>:assignments.map(a=><article className="comment" key={a.assignment_id}><p>Assigned to {staff.find(s=>s.user_id===a.assigned_to)?.display_name??a.assigned_to}</p><p className="preserve-lines">{a.reason??'No reason shown for this assignment.'}</p><p className="small">{displayTime(a.assigned_at)} · Assigned by {a.assigned_by??'Legacy record: actor unavailable'}</p></article>)}</section>
 {operational&&!terminal&&<form className="panel workflow-actions" noValidate onSubmit={change} aria-busy={busy}><h2>Add a comment</h2><input type="hidden" name="operation" value="comment"/><label>Comment<Textarea className="resize-none" name="note" required maxLength={4000}/></label><label>Visibility<select name="visible"><option value="public">Requester-visible</option><option value="private">Internal staff only</option></select></label><button className="button" disabled={busy}>Save comment</button></form>}
 {terminal&&<section className="panel workflow-actions"><h2>Reopening requests</h2>{reopenings.map(x=><p key={x.reopening_id}>{x.reason} · {displayTime(x.created_at)}</p>)}{(actor.ownsRequest||actor.role==='manager')&&!reopenings.some(x=>x.requested_by===actor.id)&&<form noValidate onSubmit={change} aria-busy={busy}><input type="hidden" name="operation" value="reopen"/><label>Reason<Textarea className="resize-none" name="note" required maxLength={4000}/></label><button className="button" disabled={busy}>Request reopening</button></form>}<p className="small">This records a request for review. It does not change the terminal status.</p></section>}
 </div><aside><section className="panel"><p className="eyebrow">Request history</p><h2>Status history</h2><ol className="timeline">{[...history].reverse().map(h=><li key={h.status_history_id}><strong>{h.statuses?.name}</strong><time>{displayTime(h.changed_at)}</time><span className="small">Actor: {h.changed_by??'Legacy record: actor unavailable'}</span></li>)}</ol></section>
 {operational&&!terminal&&<>
 {nextStatuses.length>0&&<form className="panel workflow-actions" noValidate onSubmit={change} aria-busy={busy}><h2>Change status</h2><input type="hidden" name="operation" value="transition"/><label>Next status<select name="status" required>{nextStatuses.map(s=><option key={s}>{s}</option>)}</select></label><label>Decision or resolution note<Textarea className="resize-none" name="note" maxLength={4000} placeholder="Required for rejection, resolution or closure"/></label>{status==='Submitted'&&<label>Target date/time (your local time)<input type="datetime-local" name="targetAt"/></label>}<button className="button" disabled={busy}>Save status</button></form>}
 {['Accepted','Assigned','In Progress'].includes(status)&&(actor.role==='manager'||!assignments[0]||assignments[0].assigned_to===actor.id)&&<form className="panel workflow-actions" noValidate onSubmit={change} aria-busy={busy}><h2>Assignment</h2>
 {managerDirectory&&<><ApiState state={directory}/>{directoryInvalid&&<div role="alert"><p>Staff information could not be read.</p><button className="nav-button" type="button" onClick={directory.reload}>Try again</button></div>}{!directory.loading&&!directory.error&&directoryValid&&staff.length===0&&<p id="staff-directory-message" role="status">No eligible staff are available for this request. Ask a manager to check category access and sensitive-information clearance.</p>}</>}
 <input type="hidden" name="operation" value="assign"/><label>Responsible staff<select name="assignedTo" value={selectedAssignee} onChange={e=>{setAssignmentSelection(e.target.value);setAssignmentError('');}} required disabled={busy||directoryUnavailable}>{actor.role==='staff'?<option value={actor.id}>Assign to me</option>:<><option value="" disabled>Choose a staff member</option>{staff.map(s=><option value={s.user_id} key={s.user_id}>{s.display_name}</option>)}</>}</select></label><label>Target date/time (your local time)<input type="datetime-local" name="targetAt"/></label><label htmlFor="assignment-note">{isReassignment?'Reassignment reason (required)':'Assignment note (optional)'}</label><Textarea id="assignment-note" className="resize-none" name="note" required={isReassignment} maxLength={4000} aria-invalid={Boolean(assignmentError)} aria-describedby={assignmentError?'assignment-help assignment-error':'assignment-help'} onChange={()=>setAssignmentError('')} disabled={busy}/><p id="assignment-help" className="small">Explain why responsibility is changing. The reason is saved in the request updates.</p>{assignmentError&&<p id="assignment-error" role="alert">{assignmentError}</p>}<button className="button" disabled={busy||directoryUnavailable||!selectedAssignee}>Save assignment</button></form>}
 </>}
 </aside></div></>;
}
