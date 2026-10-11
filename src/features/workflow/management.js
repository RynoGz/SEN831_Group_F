"use client";
import {useApi,ApiState} from './use-api';
import {summarize} from '@/domain/requests/reporting';
export default function Management(){const state=useApi('/api/work');
 if(state.loading||state.error)return <ApiState state={state}/>;
 if(state.data.actor.role!=='manager')return <p role="alert">Management access is not permitted.</p>;
 const totals=summarize(state.data.requests);
 return <><p>Summaries cover up to the latest 1,000 records visible to your account. Restricted requests outside your permission are excluded.</p>
 <div className="summary-grid">{['total','open','overdue','resolved','closed','rejected'].map(k=><section className="panel" key={k}><h2>{k}</h2><strong className="metric">{totals[k]}</strong></section>)}</div>
 {['byCategory','byStatus'].map((key,i)=><section className="panel" key={key}><h2>{i===0?'By category':'By status'}</h2><table><thead><tr><th scope="col">Group</th><th scope="col">Requests</th></tr></thead><tbody>{Object.entries(totals[key]).map(([group,count])=><tr key={group}><th scope="row">{group}</th><td>{count}</td></tr>)}</tbody></table></section>)}</>;
}
