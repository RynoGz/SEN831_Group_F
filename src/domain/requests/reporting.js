const terminal=new Set(['Resolved','Closed','Rejected']);
export function isOverdue(request,now=Date.now()){
 const target=Date.parse(request.target_at);
 return Number.isFinite(target)&&target<now&&!terminal.has(request.statuses?.name);
}
export function summarize(requests,now=Date.now()){
 const result={total:requests.length,open:0,overdue:0,resolved:0,closed:0,rejected:0,byCategory:{},byStatus:{}};
 for(const r of requests){const status=r.statuses?.name??'Unknown';const category=r.categories?.name??'Unknown';
  if(!terminal.has(status)) result.open++;
  if(isOverdue(r,now))result.overdue++;
  if(status==='Resolved')result.resolved++;
  if(status==='Closed')result.closed++;
  if(status==='Rejected')result.rejected++;
  result.byCategory[category]=(result.byCategory[category]??0)+1;
  result.byStatus[status]=(result.byStatus[status]??0)+1;
 }
 return result;
}
