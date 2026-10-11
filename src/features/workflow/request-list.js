"use client";
import Link from 'next/link';
import {useState} from 'react';
import {useApi,ApiState,displayTime} from './use-api';
import {isOverdue} from '@/domain/requests/reporting';
import {REQUEST_STATUSES} from '@/domain/requests/request-transition-policy';
export default function RequestList({work=false}){
 const state=useApi(work?'/api/work':'/api/my-requests');
 const [query,setQuery]=useState('');const [status,setStatus]=useState('');const [category,setCategory]=useState('');const [sort,setSort]=useState('newest');
 const rows=state.data?.requests??[];
 const categories=[...new Map(rows.map(r=>[r.category_id,r.categories?.name])).entries()];
 const filtered=rows.filter(r=>(!status||r.statuses?.name===status)&&(!category||r.category_id===category)&&[r.title,r.location,r.request_id].some(v=>v.toLowerCase().includes(query.toLowerCase()))).sort((a,b)=>sort==='oldest'?Date.parse(a.created_at)-Date.parse(b.created_at):Date.parse(b.created_at)-Date.parse(a.created_at));
 return <><ApiState state={state}/>{state.data&&<>
 <form className="panel filters" onSubmit={e=>e.preventDefault()}>
 <label>Search title, location or reference<input value={query} onChange={e=>setQuery(e.target.value)}/></label>
 <label>Status<select value={status} onChange={e=>setStatus(e.target.value)}><option value="">All statuses</option>{REQUEST_STATUSES.map(s=><option key={s}>{s}</option>)}</select></label>
 <label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{categories.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label>
 <label>Sort<select value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label>
 </form>
 <p role="status">{filtered.length} matching requests. Views show up to the latest 1,000 accessible records.</p>
 <div className="request-list">{filtered.map(r=><article className="panel" key={r.request_id}>
 <p className="eyebrow">{r.statuses?.name}{isOverdue(r)&&' · Overdue'}</p><h2><Link href={`/requests/${r.request_id}`}>{r.title}</Link></h2><p>{r.categories?.name} · {r.location}</p><p className="small">Submitted: {displayTime(r.created_at)}</p>
 </article>)}</div>{filtered.length===0&&<p>No requests match this view.</p>}
 </>}</>;
}
