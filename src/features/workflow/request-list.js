"use client";
import Link from 'next/link';
import {Suspense,useEffect,useRef,useState} from 'react';
import {useRouter,useSearchParams} from 'next/navigation';
import {useApi,ApiState,displayTime} from './use-api';
import {isOverdue} from '@/domain/requests/reporting';
import {REQUEST_STATUSES} from '@/domain/requests/request-transition-policy';
import StatusBadge from '@/components/status-badge';

export default function RequestList(props){
 return <Suspense fallback={<p role="status">Loading requests...</p>}><PagedRequestList {...props}/></Suspense>;
}
function PagedRequestList({work=false}){
 const router=useRouter();const params=useSearchParams();
 const [query,setQuery]=useState(params.get('query')??'');
 const timer=useRef(null);const composing=useRef(false);
 const status=params.get('status')??'';const category=params.get('category')??'';
 const sort=params.get('sort')??'newest';
 const apiParams=new URLSearchParams();
 for(const key of ['query','status','category','sort','page','pageSize'])if(params.has(key))apiParams.set(key,params.get(key));
 const state=useApi(`${work?'/api/work':'/api/my-requests'}?${apiParams}`,{retainPreviousData:true});
 useEffect(()=>{
  function restore(){clearTimeout(timer.current);setQuery(new URLSearchParams(window.location.search).get('query')??'');}
  window.addEventListener('popstate',restore);
  return ()=>{clearTimeout(timer.current);window.removeEventListener('popstate',restore);};
 },[]);
 function update(values){
  clearTimeout(timer.current);
  const next=new URLSearchParams(params.toString());
  next.set('query',query.trim());next.set('page','1');
  for(const [key,value] of Object.entries(values)){if(value)next.set(key,String(value));else next.delete(key);}
  if(!next.get('query'))next.delete('query');
  router.replace(`?${next}`,{scroll:false});
 }
 function search(value){setQuery(value);clearTimeout(timer.current);
  if(!composing.current)timer.current=setTimeout(()=>update({query:value.trim()}),value?300:0);
 }
 function clear(){setQuery('');update({query:'',status:'',category:''});}
 const rows=state.data?.requests??[];const totals=state.data?.summary;
 const pagination=state.data?.pagination??{page:1,pages:1,total:0,pageSize:25};
 const categories=state.data?.categories??[];const hasFilters=Boolean(params.get('query')||status||category);
 const counts=[{label:work?'Visible requests':'All requests',value:totals?.total??0,note:hasFilters?'Matching your filters':work?'Within your scoped queue':'Submitted by you'},{label:'In progress',value:totals?.byStatus['In Progress']??0,note:'Being worked on'},{label:'Resolved',value:totals?.resolved??0,note:'Ready for the next step'},{label:'Submitted',value:totals?.byStatus.Submitted??0,note:'Awaiting review'}];
 return <><ApiState state={state}/>{totals&&<div className="summary-grid request-metrics">{counts.map((item,i)=><section className={`metric-card ${i===0?'metric-featured':''}`} key={item.label}><h2>{item.label}</h2><strong className="metric">{item.value}</strong><p>{item.note}</p></section>)}</div>}
 <section className="panel list-panel" aria-busy={state.loading}><div className="panel-heading"><h2>{work?'Requests in your scope':'Your requests'}</h2><span className="small">{sort==='newest'?'Newest first':'Oldest first'}</span></div>
 <form className="filters" onSubmit={e=>{e.preventDefault();update({query:query.trim()});}} noValidate>
 <label>Search title, location or reference<input type="search" maxLength={200} placeholder="Search requests" value={query} onChange={e=>search(e.target.value)} onCompositionStart={()=>{composing.current=true;clearTimeout(timer.current);}} onCompositionEnd={e=>{composing.current=false;search(e.currentTarget.value);}}/></label>
 <label>Status<select value={status} onChange={e=>update({status:e.target.value})}><option value="">All statuses</option>{REQUEST_STATUSES.map(s=><option key={s}>{s}</option>)}</select></label>
 <label>Category<select value={category} onChange={e=>update({category:e.target.value})}><option value="">All categories</option>{categories.map(({id,name})=><option key={id} value={id}>{name}</option>)}</select></label>
 <label>Sort<select value={sort} onChange={e=>update({sort:e.target.value})}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label>
 </form>
 {state.data&&<><table className="request-table"><thead><tr><th scope="col">Request</th><th scope="col">Status</th><th scope="col">Category / submitted</th><th scope="col"><span className="sr-only">Action</span></th></tr></thead><tbody>{rows.map(r=><tr key={r.request_id}><td><Link className="request-title" href={`/requests/${r.request_id}`}>{r.title}</Link><span className="small row-subtitle">{r.location} · …{r.request_id.slice(-8)}</span></td><td><StatusBadge status={r.statuses?.name} overdue={isOverdue(r)}/></td><td>{r.categories?.name}<span className="small row-subtitle">{displayTime(r.created_at)}</span></td><td><Link className="text-link" href={`/requests/${r.request_id}`} aria-label={`View request: ${r.title}`}>View request</Link></td></tr>)}</tbody></table>
 {rows.length===0&&!state.loading&&<div className="empty-state"><h2>{hasFilters?'No matching requests':'No requests yet'}</h2><p>{hasFilters?'Try another search or clear your filters.':work?'There are no requests in your authorised scope.':'Create a request when something needs attention.'}</p>{hasFilters&&<button className="nav-button" onClick={clear}>Clear filters</button>}{!work&&!hasFilters&&<Link className="button" href="/requests/new">Create a request</Link>}</div>}
 <div className="list-footer pagination"><span role="status">{pagination.total} matching requests. Page {pagination.page} of {pagination.pages}.</span><nav aria-label="Request pages"><button className="nav-button" disabled={state.loading||pagination.page<=1} onClick={()=>update({page:pagination.page-1})}>Previous</button><button className="nav-button" disabled={state.loading||pagination.page>=pagination.pages} onClick={()=>update({page:pagination.page+1})}>Next</button></nav></div></>}
 </section><p className="small record-limit">{work?'Scope and clearance apply.':'Only your requests are shown.'} Counts include all matching requests.</p></>;
}
