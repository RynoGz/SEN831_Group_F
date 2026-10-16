// Framework-independent Supabase boundary, shared by routes and integration checks.
import { validateRequestInput } from '../requests/validate-request.js';
import { assertTransitionAllowed } from '../../domain/requests/request-transition-policy.js';
import { assignmentReasonError } from '../../domain/requests/assignment-reason.js';
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export class WorkflowError extends Error {
 constructor(message,status=400){ super(message); this.status=status; }
}
function checked(result){
 if(result.error){
  const conflict=['PT409','40001'].includes(result.error.code);
  throw new WorkflowError(conflict?'This request has changed. Reload it and try again.':'The operation could not be completed.',conflict?409:result.error.code==='42501'?403:400);
 }
 return result.data;
}
export async function session(client){
 const {data,error}=await client.auth.getUser();
 if(error||!data?.user) throw new WorkflowError('Please sign in.',401);
 const membership=checked(await client.from('service_members').select('*').eq('user_id',data.user.id).maybeSingle());
 return {id:data.user.id,role:membership?.role??'requester',name:membership?.display_name??data.user.email,canViewSensitive:membership?.can_view_sensitive??false};
}
export async function listRequests(client,{own=false,query='',status='',category='',sort='newest'}={}){
 const actor=await session(client);
 let builder=client.from('requests').select('*,categories(name),statuses(name)').order('created_at',{ascending:sort==='oldest'}).limit(1000);
 if(own){const profile=checked(await client.from('requesters').select('requester_id').eq('auth_user_id',actor.id).maybeSingle()); if(!profile) throw new WorkflowError('Your requester profile needs to be provisioned.',409); builder=builder.eq('requester_id',profile.requester_id);}
 else if(!['staff','manager'].includes(actor.role)) throw new WorkflowError('Work access is not permitted.',403);
 let data=checked(await builder)??[];
 if(!own){const scopes=checked(await client.from('service_scopes').select('category_id').eq('user_id',actor.id))??[]; const allowed=new Set(scopes.map(s=>s.category_id)); data=data.filter(r=>allowed.has(r.category_id)&&(!r.sensitive_information||actor.canViewSensitive));}
 const needle=typeof query==='string'?query.trim().toLowerCase():'';
 return data.filter(r=>(!status||r.statuses?.name===status)&&(!category||r.category_id===category)&&(!needle||[r.title,r.location,r.request_id].some(s=>s.toLowerCase().includes(needle))));
}
export async function detail(client,id){
 const actor=await session(client);
 if(!UUID.test(id)) throw new WorkflowError('Request unavailable.',404);
 const row=checked(await client.from('requests').select('*,categories(name),statuses(name)').eq('request_id',id).maybeSingle());
 if(!row) throw new WorkflowError('Request unavailable.',404);
 // The parent request is authorised above; these read-only queries are independent.
 const results=await Promise.all([
  client.from('status_history').select('*,statuses(name)').eq('request_id',id).order('changed_at'),
  client.from('request_comments').select('*').eq('request_id',id).order('created_at'),
  client.rpc('m3_assignment_history',{p_id:id}),
  client.from('reopening_requests').select('*').eq('request_id',id),
  client.rpc('m3_is_owner',{p_id:id}),
  client.rpc('m3_can_work',{p_id:id}),
 ]);
 const [history,comments,assignments,reopenings,ownsRequest,canWork]=results.map(checked);
 return {request:row,history:history??[],comments:comments??[],assignments:assignments??[],reopenings:reopenings??[],actor:{...actor,ownsRequest,canWork}};
}
export async function submit(client,input){
 const actor=await session(client);
 const categories=checked(await client.from('categories').select('category_id,name'))??[];
 const validation=validateRequestInput(input,categories.map(c=>({id:c.category_id,name:c.name})));
 if(!validation.valid) return {ok:false,fieldErrors:validation.errors};
 const profile=checked(await client.from('requesters').select('requester_id').eq('auth_user_id',actor.id).maybeSingle());
 if(!profile) throw new WorkflowError('Your requester profile needs to be provisioned.',409);
 const v=validation.values;
 const row=checked(await client.from('requests').insert({title:v.title,description:v.description,location:v.location,category_id:v.categoryId,requester_id:profile.requester_id,sensitive_information:v.sensitiveInformation}).select('request_id,created_at').single());
 return {ok:true,request:{id:row.request_id,createdAt:row.created_at,status:'Submitted'}};
}
export async function change(client,id,input){
 if(!input||!Number.isInteger(input.version)||input.version<1) throw new WorkflowError('Reload the request before updating it.');
 if(typeof input.operation!=='string'||(input.note!=null&&typeof input.note!=='string')||(input.targetAt!=null&&typeof input.targetAt!=='string')||(input.visible!=null&&typeof input.visible!=='boolean'))throw new WorkflowError('Invalid update information.');
 const current=await detail(client,id);
 if(input.operation==='assign'){
  const error=assignmentReasonError(current.assignments[0]?.assigned_to,input.assignedTo,input.note);
  if(error)throw new WorkflowError(error);
 }
 if(input.operation==='transition'){
  try{assertTransitionAllowed(current.request.statuses?.name,input.status);}catch{throw new WorkflowError('That status change is not allowed.');}
 }
 const target=input.targetAt;
 if(target&&Number.isNaN(Date.parse(target))) throw new WorkflowError('Enter a valid target time.');
 return checked(await client.rpc('m3_change_request',{
 p_id:id,p_expected_version:input.version,p_operation:input.operation,p_status:input.status??null,
 p_assigned_to:input.assignedTo??null,p_note:input.note?.trim()||null,p_visible:input.visible??true,p_target_at:target||null
 }));
}
