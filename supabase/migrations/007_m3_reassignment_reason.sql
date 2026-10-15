-- CR-M3-01 simulated client request approved for implementation by Ryno, 15 October 2026.
-- Additive migration: preserve existing assignment records and existing RPC permissions.
alter table public.assignments add column reason text;
alter table public.assignments add column reason_requester_visible boolean not null default true;
alter table public.assignments add constraint assignment_reason_length
 check (reason is null or length(btrim(reason)) between 1 and 4000);

create or replace function public.m3_change_request(p_id uuid,p_expected_version integer,p_operation text,
 p_status text default null,p_assigned_to uuid default null,p_note text default null,
 p_visible boolean default true,p_target_at timestamptz default null)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r public.requests; current_state text; actor_role text; next_id uuid; current_assignee uuid;
begin
 if auth.uid() is null or not public.m3_can_read(p_id) then raise exception 'Request unavailable' using errcode='42501'; end if;
 select * into r from public.requests where request_id=p_id for update;
 if p_expected_version is null or r.version<>p_expected_version then raise exception 'Request changed; reload and retry' using errcode='40001'; end if;
 select name into current_state from public.statuses where status_id=r.status_id;
 select role into actor_role from public.service_members where user_id=auth.uid();
 select assigned_to into current_assignee from public.assignments where request_id=p_id order by assigned_at desc,assignment_id desc limit 1;
 if p_operation='reopen' then
  if not (public.m3_is_owner(p_id) or (actor_role='manager' and public.m3_can_work(p_id)))
    or current_state not in ('Closed','Rejected') then raise exception 'Reopening request not permitted' using errcode='42501'; end if;
  if p_note is null or length(btrim(p_note)) not between 1 and 4000 then raise exception 'Enter a reopening reason'; end if;
  insert into public.reopening_requests(request_id,requested_by,reason) values(p_id,auth.uid(),btrim(p_note));
 else
  if not public.m3_can_work(p_id) then raise exception 'Operation not permitted' using errcode='42501'; end if;
  if p_operation='transition' then
   if not ((current_state='Submitted' and p_status in ('Accepted','Rejected'))
    or (current_state='Assigned' and p_status='In Progress')
    or (current_state='In Progress' and p_status='Resolved')
    or (current_state='Resolved' and p_status='Closed')) then raise exception 'Invalid lifecycle transition'; end if;
   if actor_role<>'manager' and ((current_state<>'Submitted' and current_assignee is distinct from auth.uid()) or p_status='Closed')
     then raise exception 'Operation not permitted' using errcode='42501'; end if;
   if p_status in ('Rejected','Resolved','Closed') and (p_note is null or length(btrim(p_note)) not between 1 and 4000)
     then raise exception 'Enter the decision or resolution reason'; end if;
   if p_target_at is not null and current_state<>'Submitted' then raise exception 'Set the target during acceptance or assignment'; end if;
   select status_id into next_id from public.statuses where name=p_status;
   update public.requests set status_id=next_id,target_at=coalesce(p_target_at,target_at) where request_id=p_id;
   insert into public.status_history(request_id,status_id,changed_by) values(p_id,next_id,auth.uid());
  elsif p_operation='assign' then
   if actor_role<>'manager' and p_assigned_to is distinct from auth.uid() then raise exception 'Only managers may assign others' using errcode='42501'; end if;
   if current_state not in ('Accepted','Assigned','In Progress') then raise exception 'Assignment not permitted in this state'; end if;
   if actor_role<>'manager' and current_assignee is not null and current_assignee<>auth.uid() then raise exception 'Only managers may reassign' using errcode='42501'; end if;
   if not exists(select 1 from public.service_members m join public.service_scopes s using(user_id)
    where m.user_id=p_assigned_to and m.role='staff' and s.category_id=r.category_id
     and (not r.sensitive_information or m.can_view_sensitive)) then raise exception 'Assignee is not authorised for this request'; end if;
   -- Match JavaScript trim whitespace, including Unicode-only blank RPC input.
   p_note := nullif(btrim(p_note, chr(9) || chr(10) || chr(11) || chr(12) || chr(13) || chr(32) || chr(160) || chr(5760) || chr(8192) || chr(8193) || chr(8194) || chr(8195) || chr(8196) || chr(8197) || chr(8198) || chr(8199) || chr(8200) || chr(8201) || chr(8202) || chr(8232) || chr(8233) || chr(8239) || chr(8287) || chr(12288) || chr(65279)), '');
   if current_assignee is not null and current_assignee is distinct from p_assigned_to
     and p_note is null then raise exception 'Enter a reason for changing the responsible staff member'; end if;
   if p_note is not null and length(p_note)>4000 then raise exception 'Assignment reason must contain 1 to 4000 characters'; end if;
   insert into public.assignments(request_id,assigned_to,assigned_by,reason,reason_requester_visible) values(p_id,p_assigned_to,auth.uid(),p_note,coalesce(p_visible,true));
   if current_state='Accepted' then
    select status_id into next_id from public.statuses where name='Assigned';
    update public.requests set status_id=next_id where request_id=p_id;
    insert into public.status_history(request_id,status_id,changed_by) values(p_id,next_id,auth.uid());
   end if;
   update public.requests set target_at=coalesce(p_target_at,target_at) where request_id=p_id;
  elsif p_operation='comment' then
   if current_state in ('Closed','Rejected') then raise exception 'Terminal requests cannot be edited'; end if;
  else raise exception 'Unknown operation'; end if;
  if p_note is not null then
   if length(btrim(p_note)) not between 1 and 4000 then raise exception 'Comment must contain 1 to 4000 characters'; end if;
   if p_visible is null then raise exception 'Specify comment visibility'; end if;
   -- Decision/resolution feedback must be available to the requester.
   insert into public.request_comments(request_id,author_id,body,requester_visible)
    values(p_id,auth.uid(),btrim(p_note),case when p_operation='transition' then true else p_visible end);
  elsif p_operation='comment' then raise exception 'Enter a comment'; end if;
 end if;
 update public.requests set version=version+1 where request_id=p_id;
 return jsonb_build_object('id',p_id,'version',r.version+1);
end; $$;


-- Preserve legacy assignment metadata access while preventing direct reason-column disclosure.
revoke select on public.assignments from authenticated;
grant select(assignment_id,request_id,assigned_to,assigned_at,assigned_by) on public.assignments to authenticated;
create function public.m3_assignment_history(p_id uuid)
returns table(assignment_id uuid,request_id uuid,assigned_to uuid,assigned_at timestamptz,assigned_by uuid,reason text)
language sql stable security definer set search_path=public as $$
 select a.assignment_id,a.request_id,a.assigned_to,a.assigned_at,a.assigned_by,
 case when a.reason_requester_visible or public.m3_can_work(p_id) then a.reason else null end
 from public.assignments a where a.request_id=p_id and public.m3_can_read(p_id)
 order by a.assigned_at desc,a.assignment_id desc;
$$;
revoke all on function public.m3_assignment_history(uuid) from public,anon;
grant execute on function public.m3_assignment_history(uuid) to authenticated;
