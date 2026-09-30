-- CivicConnect
-- M2 Request Access Policies
-- Migration: 003_request_rls

grant select on public.categories to anon, authenticated;
grant select on public.requesters to authenticated;
grant insert on public.requests to authenticated;
grant select on public.requests to authenticated;
grant select on public.status_history to authenticated;

alter table public.categories enable row level security;
alter table public.requesters enable row level security;
alter table public.requests enable row level security;
alter table public.status_history enable row level security;

drop policy if exists "Anyone can read categories" on public.categories;
create policy "Anyone can read categories"
on public.categories
for select
to anon, authenticated
using (true);

drop policy if exists "Users can read their requester profile" on public.requesters;
create policy "Users can read their requester profile"
on public.requesters
for select
to authenticated
using (auth_user_id = auth.uid());

drop policy if exists "Users can create their own requests" on public.requests;
create policy "Users can create their own requests"
on public.requests
for insert
to authenticated
with check (
    requester_id in (
        select requester_id
        from public.requesters
        where auth_user_id = auth.uid()
    )
);

drop policy if exists "Users can read their own requests" on public.requests;
create policy "Users can read their own requests"
on public.requests
for select
to authenticated
using (
    requester_id in (
        select requester_id
        from public.requesters
        where auth_user_id = auth.uid()
    )
);

drop policy if exists "Users can read their own status history" on public.status_history;
create policy "Users can read their own status history"
on public.status_history
for select
to authenticated
using (
    request_id in (
        select request_id
        from public.requests
        where requester_id in (
            select requester_id
            from public.requesters
            where auth_user_id = auth.uid()
        )
    )
);