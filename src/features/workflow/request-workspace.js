"use client";
import Link from 'next/link';
import {useState} from 'react';
import {useApi,ApiState,displayTime} from './use-api';
import {canTransition,REQUEST_STATUSES} from '@/domain/requests/request-transition-policy';
import {isOverdue} from '@/domain/requests/reporting';
import AttachmentUpload from './attachment-upload';
export default function RequestWorkspace({requestId}){
 const [revision,setRevision]=useState(0);const state=useApi(`/api/requests/${requestId}?revision=${revision}`);
 const directory=useApi('/api/work');const [pending,setPending]=useState(false);const [message,setMessage]=useState('');
 async function change(event){event.preventDefault();const form=new FormData(event.currentTarget);setPending(true);setMessage('');
  const target=form.get('targetAt');
  try{const response=await fetch(`/api/requests/${requestId}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({version:state.data.request.version,operation:form.get('operation'),status:form.get('status')||null,assignedTo:form.get('assignedTo')||null,note:form.get('note')||null,visible:form.get('visible')!=='private',targetAt:target?new Date(target).toISOString():null})});
   const result=await response.json();if(!response.ok)throw new Error(result.error);setMessage('Update saved.');setRevision(r=>r+1);
  }catch(e){setMessage(e.message||'The update failed.');}finally{setPending(false);}
 }
 if(!state.data)return <ApiState state={state}/>;
 const {request:r,history,comments,assignments,reopenings,actor}=state.data;const status=r.statuses?.name;
 const operational=actor.canWork&&['staff','manager'].includes(actor.role);const terminal=['Closed','Rejected'].includes(status);
 const nextStatuses=REQUEST_STATUSES.filter(s=>canTransition(status,s)&&s!=='Assigned'&&(actor.role==='manager'||(status==='Submitted'||(assignments[0]?.assigned_to===actor.id&&s!=='Closed'))));
 const staff=(directory.data?.staff??[]).filter(s=>s.category_id===r.category_id&&(!r.sensitive_information||s.can_view_sensitive));
 return <div className="narrow"><div className="page-heading"><p className="eyebrow">{status}{isOverdue(r)&&' · Overdue'}</p><h1>{r.title}</h1><p className="lead preserve-lines">{r.description}</p></div>
 <section className="panel"><h2>Request details</h2><dl className="details-grid"><div><dt>Reference</dt><dd>{r.request_id}</dd></div><div><dt>Category</dt><dd>{r.categories?.name}</dd></div><div><dt>Location</dt><dd>{r.location}</dd></div><div><dt>Submitted</dt><dd>{displayTime(r.created_at)}</dd></div><div><dt>Target</dt><dd>{displayTime(r.target_at)}</dd></div><div><dt>Sensitive</dt><dd>{r.sensitive_information?'Yes':'No'}</dd></div><div><dt>Assigned user</dt><dd>{assignments[0]?.assigned_to??'Unassigned'}</dd></div></dl>
 {r.attachment_reference?<a href={`/api/requests/${r.request_id}/attachment`}>Download private attachment</a>:actor.ownsRequest?<AttachmentUpload requestId={r.request_id} onSaved={()=>setRevision(v=>v+1)}/>:<p>No attachment.</p>}</section>
 <section className="panel"><h2>Status history</h2><ol>{history.map(h=><li key={h.status_history_id}><strong>{h.statuses?.name}</strong> · {displayTime(h.changed_at)}<br/><span className="small">Actor: {h.changed_by??'Legacy record: actor unavailable'}</span></li>)}</ol></section>
 <section className="panel"><h2>Updates and comments</h2>{comments.length===0?<p>No updates yet.</p>:comments.map(c=><article key={c.comment_id}><p className="preserve-lines">{c.body}</p><p className="small">{c.requester_visible?'Requester-visible':'Internal'} · {displayTime(c.created_at)} · {c.author_id}</p></article>)}</section>
 <p role="status">{message}</p>
 {operational&&!terminal&&<>
 {nextStatuses.length>0&&<form className="panel" onSubmit={change}><h2>Change status</h2><input type="hidden" name="operation" value="transition"/><label>Next status<select name="status" required>{nextStatuses.map(s=><option key={s}>{s}</option>)}</select></label><label>Decision or resolution note<textarea name="note" maxLength={4000} placeholder="Required for rejection, resolution or closure"/></label>{status==='Submitted'&&<label>Target date/time (your local time)<input type="datetime-local" name="targetAt"/></label>}<button className="button" disabled={pending}>Save status</button></form>}
 {['Accepted','Assigned','In Progress'].includes(status)&&(actor.role==='manager'||!assignments[0]||assignments[0].assigned_to===actor.id)&&<form className="panel" onSubmit={change}><h2>Assignment</h2><input type="hidden" name="operation" value="assign"/><label>Responsible staff<select name="assignedTo" required>{actor.role==='staff'?<option value={actor.id}>Assign to me</option>:staff.map(s=><option value={s.user_id} key={s.user_id}>{s.display_name}</option>)}</select></label><label>Target date/time (your local time)<input type="datetime-local" name="targetAt"/></label><label>Assignment note<textarea name="note" maxLength={4000}/></label><button className="button" disabled={pending}>Save assignment</button></form>}
 <form className="panel" onSubmit={change}><h2>Add a comment</h2><input type="hidden" name="operation" value="comment"/><label>Comment<textarea name="note" required maxLength={4000}/></label><label>Visibility<select name="visible"><option value="public">Requester-visible</option><option value="private">Internal staff only</option></select></label><button className="button" disabled={pending}>Save comment</button></form>
 </>}
 {terminal&&<section className="panel"><h2>Reopening requests</h2>{reopenings.map(x=><p key={x.reopening_id}>{x.reason} · {displayTime(x.created_at)}</p>)}{(actor.ownsRequest||actor.role==='manager')&&!reopenings.some(x=>x.requested_by===actor.id)&&<form onSubmit={change}><input type="hidden" name="operation" value="reopen"/><label>Reason<textarea name="note" required maxLength={4000}/></label><button className="button" disabled={pending}>Request reopening</button></form>}<p className="small">This records a request for review. It does not change the terminal status.</p></section>}
 <Link href="/requests">Back to my requests</Link>{operational&&<p><Link href="/work">Back to work queue</Link></p>}
 </div>;
}
