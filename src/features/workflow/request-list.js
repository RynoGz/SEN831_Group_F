"use client";
import Link from 'next/link';
import {useState} from 'react';
import {useApi,ApiState,displayTime} from './use-api';
import {isOverdue} from '@/domain/requests/reporting';
import {REQUEST_STATUSES} from '@/domain/requests/request-transition-policy';
import StatusBadge from '@/components/status-badge';
export default function RequestList({work=false}){
 const state=useApi(work?'/api/work':'/api/my-requests');
 const [query,setQuery]=useState('');const [status,setStatus]=useState('');const [category,setCategory]=useState('');const [sort,setSort]=useState('newest');
 const rows=state.data?.requests??[];
 const categories=[...new Map(rows.map(r=>[r.category_id,r.categories?.name])).entries()];
 const filtered=rows.filter(r=>(!status||r.statuses?.name===status)&&(!category||r.category_id===category)&&[r.title,r.location,r.request_id].some(v=>v.toLowerCase().includes(query.toLowerCase()))).sort((a,b)=>sort==='oldest'?Date.parse(a.created_at)-Date.parse(b.created_at):Date.parse(b.created_at)-Date.parse(a.created_at));
 const counts=[{label:work?'Visible requests':'All requests',value:rows.length,note:work?'Within your scoped queue':'Submitted by you'},{label:'In progress',value:rows.filter(r=>r.statuses?.name==='In Progress').length,note:'Being worked on'},{label:'Resolved',value:rows.filter(r=>r.statuses?.name==='Resolved').length,note:'Ready for the next step'},{label:'Submitted',value:rows.filter(r=>r.statuses?.name==='Submitted').length,note:'Awaiting review'}];
 return <><ApiState state={state}/>{state.data&&<>
 <div className="summary-grid request-metrics">{counts.map((item,i)=><section className={`metric-card ${i===0?'metric-featured':''}`} key={item.label}><h2>{item.label}</h2><strong className="metric">{item.value}</strong><p>{item.note}</p></section>)}</div>
 <section className="panel list-panel"><div className="panel-heading"><h2>{work?'Requests in your scope':'Recent requests'}</h2><span className="small">{sort==='newest'?'Newest first':'Oldest first'}</span></div>
 <form className="filters" onSubmit={e=>e.preventDefault()} noValidate>
 <label>Search title, location or reference<input type="search" placeholder="Search requests" value={query} onChange={e=>setQuery(e.target.value)}/></label>
 <label>Status<select value={status} onChange={e=>setStatus(e.target.value)}><option value="">All statuses</option>{REQUEST_STATUSES.map(s=><option key={s}>{s}</option>)}</select></label>
 <label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{categories.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label>
 <label>Sort<select value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label>
 </form>
 <table className="request-table"><thead><tr><th scope="col">Request</th><th scope="col">Status</th><th scope="col">Category / submitted</th><th scope="col"><span className="sr-only">Action</span></th></tr></thead><tbody>{filtered.map(r=><tr key={r.request_id}><td><Link className="request-title" href={`/requests/${r.request_id}`}>{r.title}</Link><span className="small row-subtitle">{r.location} · …{r.request_id.slice(-8)}</span></td><td><StatusBadge status={r.statuses?.name} overdue={isOverdue(r)}/></td><td>{r.categories?.name}<span className="small row-subtitle">{displayTime(r.created_at)}</span></td><td><Link className="text-link" href={`/requests/${r.request_id}`} aria-label={`View request: ${r.title}`}>View request</Link></td></tr>)}</tbody></table>
 {filtered.length===0&&<div className="empty-state"><h2>{rows.length===0?'No requests yet':'No matching requests'}</h2><p>{rows.length===0?(work?'There are no requests in your authorised scope.':'Create a request when something needs attention.'):'Try another search or clear your filters.'}</p>{rows.length>0&&<button className="nav-button" onClick={()=>{setQuery('');setStatus('');setCategory('');}}>Clear filters</button>}{!work&&rows.length===0&&<Link className="button" href="/requests/new">Create a request</Link>}</div>}
 <div className="list-footer"><span role="status">{filtered.length} matching requests.</span><span>{work?'Scope and clearance apply':'Only your requests are shown'}</span></div></section><p className="small record-limit">Views show up to the latest 1,000 accessible records.</p>
 </>}</>;
}
