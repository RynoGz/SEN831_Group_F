-- CivicConnect
-- M2 Initial Database Schema
-- Migration: 001_initial_schema

create extension if not exists "pgcrypto";

-- ============================================================
-- REQUESTERS
-- ============================================================

create table public.requesters (
    requester_id uuid primary key default gen_random_uuid(),

    -- Supabase Auth user identifier.
    auth_user_id uuid unique,

    full_name text not null,
    email text not null,

    created_at timestamptz not null default now(),

    constraint chk_requesters_full_name
        check (btrim(full_name) <> ''),

    constraint chk_requesters_email
        check (btrim(email) <> '')
);

-- Prevent duplicate email addresses regardless of letter casing.
create unique index uq_requesters_email_lower
    on public.requesters (lower(email));

-- ============================================================
-- CATEGORIES
-- ============================================================

create table public.categories (
    category_id uuid primary key default gen_random_uuid(),

    name text not null unique,

    constraint chk_categories_name
        check (
            name in (
                'Maintenance',
                'IT support',
                'Facility fault',
                'Damaged equipment',
                'Security concern',
                'Lost property',
                'Other'
            )
        )
);

-- ============================================================
-- STATUSES
-- ============================================================

create table public.statuses (
    status_id uuid primary key default gen_random_uuid(),

    name text not null unique,

    constraint chk_statuses_name
        check (
            name in (
                'Submitted',
                'Accepted',
                'Assigned',
                'In Progress',
                'Resolved',
                'Closed',
                'Rejected'
            )
        )
);

-- ============================================================
-- REQUESTS
-- ============================================================

create table public.requests (
    request_id uuid primary key default gen_random_uuid(),

    title text not null,
    description text not null,
    location text not null,

    requester_id uuid not null,
    category_id uuid not null,
    status_id uuid not null,

    sensitive_information boolean not null default false,

    -- Reference to an object stored in Supabase Storage.
    attachment_reference text,

    created_at timestamptz not null default now(),

    constraint fk_requests_requester
        foreign key (requester_id)
        references public.requesters(requester_id),

    constraint fk_requests_category
        foreign key (category_id)
        references public.categories(category_id),

    constraint fk_requests_status
        foreign key (status_id)
        references public.statuses(status_id),

    constraint chk_requests_title
        check (btrim(title) <> ''),

    constraint chk_requests_description
        check (btrim(description) <> ''),

    constraint chk_requests_location
        check (btrim(location) <> '')
);

-- ============================================================
-- STATUS HISTORY
-- ============================================================

create table public.status_history (
    status_history_id uuid primary key default gen_random_uuid(),

    request_id uuid not null,
    status_id uuid not null,

    changed_at timestamptz not null default now(),

    -- Supabase Auth user who performed the status change.
    changed_by uuid,

    constraint fk_status_history_request
        foreign key (request_id)
        references public.requests(request_id)
        on delete cascade,

    constraint fk_status_history_status
        foreign key (status_id)
        references public.statuses(status_id)
);

-- ============================================================
-- ASSIGNMENTS
-- ============================================================

create table public.assignments (
    assignment_id uuid primary key default gen_random_uuid(),

    request_id uuid not null,

    -- Supabase Auth user assigned to the request.
    assigned_to uuid not null,

    assigned_at timestamptz not null default now(),

    constraint fk_assignments_request
        foreign key (request_id)
        references public.requests(request_id)
        on delete cascade
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_requests_requester_id
    on public.requests(requester_id);

create index idx_requests_category_id
    on public.requests(category_id);

create index idx_requests_status_id
    on public.requests(status_id);

create index idx_requests_created_at
    on public.requests(created_at);

create index idx_status_history_request_id
    on public.status_history(request_id);

create index idx_status_history_changed_at
    on public.status_history(changed_at);

create index idx_assignments_request_id
    on public.assignments(request_id);

-- ============================================================
-- CONTROLLED CATEGORY DATA
-- ============================================================

insert into public.categories (name)
values
    ('Maintenance'),
    ('IT support'),
    ('Facility fault'),
    ('Damaged equipment'),
    ('Security concern'),
    ('Lost property'),
    ('Other');

-- ============================================================
-- CONTROLLED STATUS DATA
-- ============================================================

insert into public.statuses (name)
values
    ('Submitted'),
    ('Accepted'),
    ('Assigned'),
    ('In Progress'),
    ('Resolved'),
    ('Closed'),
    ('Rejected');

-- ============================================================
-- DEFAULT INITIAL STATUS
-- ============================================================

create or replace function public.set_initial_request_status()
returns trigger
language plpgsql
as $$
begin
    select status_id
    into new.status_id
    from public.statuses
    where name = 'Submitted';

    if new.status_id is null then
        raise exception 'Submitted status is not configured';
    end if;

    return new;
end;
$$;

create trigger trg_requests_initial_status
before insert on public.requests
for each row
execute function public.set_initial_request_status();