"use client";
import Link from 'next/link';
import {useApi,ApiState} from './use-api';
import {summarize} from '@/domain/requests/reporting';
export default function Management(){
 const state=useApi('/api/work');
 if(state.loading||state.error)return <ApiState state={state}/>;
 if(state.data.actor.role!=='manager')return <p role="alert">Management access is not permitted.</p>;
 const totals=summarize(state.data.requests);
 return <><div className="summary-grid management-metrics">{['open','overdue','resolved','closed','total','rejected'].map((k,i)=><section className={`metric-card ${i===0?'metric-featured':''}`} key={k}><h2>{k==='open'?'Open requests':k==='total'?'All requests':k}</h2><strong className="metric">{totals[k]}</strong></section>)}</div>
 <div className="content-columns"><div>{['byCategory','byStatus'].map((key,i)=>{const entries=Object.entries(totals[key]);const max=Math.max(1,...entries.map(([,count])=>count));return <section className="panel" key={key}><h2>{i===0?'By category':'By status'}</h2>{entries.length===0?<p>No requests in your authorised scope.</p>:<table className="distribution-table"><thead><tr><th scope="col">Group</th><th scope="col">Requests</th></tr></thead><tbody>{entries.map(([group,count])=><tr key={group}><th scope="row">{group}</th><td><span className="distribution-cell"><span className="distribution-bar" aria-hidden="true"><span style={{width:`${count/max*100}%`}}/></span><strong>{count}</strong></span></td></tr>)}</tbody></table>}</section>})}</div><aside className="panel"><p className="eyebrow">Needs attention</p><h2>Keep the next step clear.</h2><div className="attention-item"><h3>{totals.overdue} overdue requests</h3><p>Review target dates and follow up with assigned staff.</p></div><div className="attention-item"><h3>{totals.resolved} resolved requests</h3><p>Review the resolution before final closure.</p></div><Link className="button" href="/work">View work queue</Link></aside></div><p className="small record-limit">Summaries cover up to the latest 1,000 records visible to your account. Restricted requests outside your permission are excluded.</p></>;
}
