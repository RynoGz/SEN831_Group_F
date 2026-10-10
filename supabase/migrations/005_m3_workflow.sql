-- Phase 1 operational refinement of the M1 least-privilege/lifecycle baseline.
-- Apply after 001-004. Memberships are provisioned by a trusted database operator.
create table public.service_members (
 user_id uuid primary key references auth.users(id),
 display_name text not null check (btrim(display_name) <> ''),
 role text not null check (role in ('staff','manager','admin')),
 can_view_sensitive boolean not null default false
);
create table public.service_scopes (
 user_id uuid references public.service_members(user_id) on delete cascade,
 category_id uuid references public.categories(category_id),
 primary key(user_id,category_id)
);
alter table public.requests add column version integer not null default 1;
alter table public.requests add column target_at timestamptz;
alter table public.assignments add column assigned_by uuid references auth.users(id);
-- Existing M2 assignment rows are preserved; newest assignment is current.
create table public.request_comments (
 comment_id uuid primary key default gen_random_uuid(),
 request_id uuid not null references public.requests(request_id) on delete cascade,
 author_id uuid not null references auth.users(id),
 body text not null check (length(btrim(body)) between 1 and 4000),
 requester_visible boolean not null default true,
 created_at timestamptz not null default now()
);
create table public.reopening_requests (
 reopening_id uuid primary key default gen_random_uuid(),
 request_id uuid not null references public.requests(request_id),
 requested_by uuid not null references auth.users(id),
 reason text not null check (length(btrim(reason)) between 1 and 4000),
 created_at timestamptz not null default now(),
 unique(request_id,requested_by)
);
create index idx_comments_request on public.request_comments(request_id);
create index idx_requests_target on public.requests(target_at);
create index idx_assignment_current on public.assignments(request_id,assigned_at desc);

create function public.m3_is_owner(p_id uuid) returns boolean
language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.requests r join public.requesters q using(requester_id)
 where r.request_id=p_id and q.auth_user_id=auth.uid()); $$;
create function public.m3_can_work(p_id uuid) returns boolean
language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.requests r
 join public.service_scopes s on s.category_id=r.category_id and s.user_id=auth.uid()
 join public.service_members m on m.user_id=s.user_id
 where r.request_id=p_id and m.role in ('staff','manager')
 and (not r.sensitive_information or m.can_view_sensitive)); $$;
create function public.m3_can_read(p_id uuid) returns boolean
language sql stable security definer set search_path = public
as $$ select public.m3_is_owner(p_id) or public.m3_can_work(p_id); $$;

alter table public.service_members enable row level security;
alter table public.service_scopes enable row level security;
alter table public.assignments enable row level security;
alter table public.statuses enable row level security;
alter table public.request_comments enable row level security;
alter table public.reopening_requests enable row level security;
grant select on public.service_members,public.service_scopes,public.assignments,public.statuses,public.request_comments,public.reopening_requests to authenticated;
grant select on public.statuses to anon;
create policy "Own service membership" on public.service_members for select to authenticated using(user_id=auth.uid());
create policy "Own service scopes" on public.service_scopes for select to authenticated using(user_id=auth.uid());
create policy "Read status vocabulary" on public.statuses for select to anon,authenticated using(true);
create policy "Scoped operational requests" on public.requests for select to authenticated using(public.m3_can_work(request_id));
create policy "Scoped operational history" on public.status_history for select to authenticated using(public.m3_can_work(request_id));
create policy "Visible assignments" on public.assignments for select to authenticated using(public.m3_can_read(request_id));
create policy "Visible comments" on public.request_comments for select to authenticated
 using(public.m3_can_read(request_id) and (requester_visible or public.m3_can_work(request_id)));
create policy "Visible reopening requests" on public.reopening_requests for select to authenticated using(public.m3_can_read(request_id));

-- A forged insert must not link someone else's object or supply workflow metadata.
drop policy "Users can create their own requests" on public.requests;
create policy "Users can create their own requests" on public.requests for insert to authenticated
with check(requester_id in(select requester_id from public.requesters where auth_user_id=auth.uid())
 and attachment_reference is null and target_at is null and version=1);
-- Never let Data API callers bypass the audited RPC write paths.

revoke update,delete on public.requests from anon,authenticated;
revoke insert,update,delete on public.assignments,public.status_history,public.request_comments,public.reopening_requests,public.service_members,public.service_scopes from anon,authenticated;

create or replace function public.create_initial_status_history() returns trigger
language plpgsql security definer set search_path=public as $$
begin
 insert into public.status_history(request_id,status_id,changed_at,changed_by)
 values(new.request_id,new.status_id,new.created_at,auth.uid());
 return new;
end; $$;

create function public.m3_staff_directory() returns table(user_id uuid,display_name text,category_id uuid,can_view_sensitive boolean)
language sql stable security definer set search_path=public as $$
 select m.user_id,m.display_name,s.category_id,m.can_view_sensitive
 from public.service_members m join public.service_scopes s using(user_id)
 where m.role='staff' and exists(select 1 from public.service_members me
 join public.service_scopes own on own.user_id=me.user_id
 where me.user_id=auth.uid() and me.role='manager' and own.category_id=s.category_id);
$$;

create function public.m3_change_request(p_id uuid,p_expected_version integer,p_operation text,
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
   insert into public.assignments(request_id,assigned_to,assigned_by) values(p_id,p_assigned_to,auth.uid());
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

revoke all on function public.m3_change_request(uuid,integer,text,text,uuid,text,boolean,timestamptz) from public,anon;
grant execute on function public.m3_change_request(uuid,integer,text,text,uuid,text,boolean,timestamptz) to authenticated;
revoke all on function public.m3_staff_directory() from public,anon;
grant execute on function public.m3_staff_directory() to authenticated;
-- Access helpers reveal only booleans about the caller's rights, never request content.
revoke all on function public.m3_is_owner(uuid),public.m3_can_work(uuid),public.m3_can_read(uuid) from public,anon;
grant execute on function public.m3_is_owner(uuid),public.m3_can_work(uuid),public.m3_can_read(uuid) to authenticated;
