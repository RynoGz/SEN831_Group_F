-- CivicConnect
-- M2 Initial Status History
-- Migration: 002_initial_status_history

create or replace function public.create_initial_status_history()
returns trigger
language plpgsql
as $$
begin
    insert into public.status_history (
        request_id,
        status_id,
        changed_at
    )
    values (
        new.request_id,
        new.status_id,
        new.created_at
    );

    return new;
end;
$$;

create trigger trg_requests_initial_status_history
after insert on public.requests
for each row
execute function public.create_initial_status_history();