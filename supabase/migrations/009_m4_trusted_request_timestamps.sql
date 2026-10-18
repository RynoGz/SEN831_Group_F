-- M4: Prevent authenticated clients from forging request creation timestamps.
-- Preserve existing request rows, status assignment, and audit history.

create or replace function public.enforce_request_creation_timestamp()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    -- Timestamps supplied by authenticated Data API clients are untrusted.
    -- Use the database clock instead.
    if auth.role() = 'authenticated' then
        new.created_at := statement_timestamp();
    end if;

    return new;
end;
$$;

create trigger trg_requests_trusted_created_at
before insert on public.requests
for each row
execute function public.enforce_request_creation_timestamp();

revoke all on function public.enforce_request_creation_timestamp() from public, anon, authenticated;
