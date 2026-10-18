-- Complete scoped lists and reports without the former 1,000-row API window.
-- Invoker rights retain table RLS; work views additionally require category/clearance.
create function public.m4_request_page(
 p_own boolean default false, p_query text default '', p_status text default '',
 p_category text default '', p_sort text default 'newest',
 p_page integer default 1, p_page_size integer default 25,
 p_summary_only boolean default false
) returns jsonb
language plpgsql stable security invoker set search_path = public
as $$
declare result jsonb;
begin
 if auth.uid() is null then
  raise exception 'Sign in required' using errcode='42501';
 end if;
 if not p_own and not exists (
  select 1 from service_members where user_id=auth.uid() and role in ('staff','manager')
 ) then
  raise exception 'Work access is not permitted' using errcode='42501';
 end if;
 if p_page is null or p_page < 1 or p_page > 2147483647
  or p_page_size is null or p_page_size < 1 or p_page_size > 100
  or p_sort is null or p_sort not in ('newest','oldest')
  or p_own is null or p_summary_only is null
  or length(coalesce(p_query,'')) > 200 then
  raise exception 'Invalid list options' using errcode='22023';
 end if;

 with authorised as materialized (
  select r.*,c.name as category_name,s.name as status_name
  from requests r join categories c using(category_id) join statuses s using(status_id)
  where (p_own and r.requester_id in (
   select requester_id from requesters where auth_user_id=auth.uid()
  )) or (not p_own and public.m3_can_work(r.request_id))
 ), filtered as materialized (
  select * from authorised
  where (coalesce(p_status,'')='' or status_name=p_status)
   and (coalesce(p_category,'')='' or category_id::text=p_category)
   and (coalesce(btrim(p_query),'')='' or
    strpos(lower(title),lower(btrim(p_query)))>0 or
    strpos(lower(location),lower(btrim(p_query)))>0 or
    strpos(request_id::text,lower(btrim(p_query)))>0)
 ), totals as (
  select count(*) as total,
   count(*) filter(where status_name not in ('Resolved','Closed','Rejected')) as open,
   count(*) filter(where target_at < statement_timestamp() and status_name not in ('Resolved','Closed','Rejected')) as overdue,
   count(*) filter(where status_name='Resolved') as resolved,
   count(*) filter(where status_name='Closed') as closed,
   count(*) filter(where status_name='Rejected') as rejected
  from filtered
 ), bounds as (
  select total,greatest(1,ceil(total::numeric/p_page_size)::integer) as pages,
   least(p_page,greatest(1,ceil(total::numeric/p_page_size)::integer)) as page
  from totals
 ), page_rows as (
  select f.* from filtered f
  order by case when p_sort='oldest' then created_at end asc,
   case when p_sort='newest' then created_at end desc,request_id asc
  limit case when p_summary_only then 0 else p_page_size end
  offset (select (page::bigint-1)*p_page_size from bounds)
 )
 select jsonb_build_object(
  'requests',coalesce((select jsonb_agg(
   (to_jsonb(r)-'category_name'-'status_name') || jsonb_build_object(
    'categories',jsonb_build_object('name',r.category_name),
    'statuses',jsonb_build_object('name',r.status_name))
   order by case when p_sort='oldest' then r.created_at end asc,
    case when p_sort='newest' then r.created_at end desc,r.request_id asc
  ) from page_rows r),'[]'::jsonb),
  'pagination',(select jsonb_build_object('page',page,'pageSize',p_page_size,'total',total,'pages',pages) from bounds),
  'summary',(select to_jsonb(t) || jsonb_build_object(
   'byCategory',coalesce((select jsonb_object_agg(category_name,n) from
    (select category_name,count(*) n from filtered group by category_name) c),'{}'::jsonb),
   'byStatus',coalesce((select jsonb_object_agg(status_name,n) from
    (select status_name,count(*) n from filtered group by status_name) s),'{}'::jsonb)
  ) from totals t),
  'categories',coalesce((select jsonb_agg(jsonb_build_object('id',category_id,'name',category_name) order by category_name)
   from (select distinct category_id,category_name from authorised) c),'[]'::jsonb)
 ) into result;
 return result;
end;
$$;

revoke all on function public.m4_request_page(boolean,text,text,text,text,integer,integer,boolean) from public,anon;
grant execute on function public.m4_request_page(boolean,text,text,text,text,integer,integer,boolean) to authenticated;
