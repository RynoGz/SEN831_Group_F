-- Private bucket and parent-request authorisation; no public URLs.
-- Operational limits: one PDF/PNG/JPEG per request, up to 5 MiB.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('request-attachments','request-attachments',false,5242880,array['application/pdf','image/png','image/jpeg']);
create function public.m3_storage_parent(p_name text) returns uuid
language plpgsql immutable as $$ begin return split_part(p_name,'/',1)::uuid;
exception when invalid_text_representation then return null; end; $$;
create policy "Upload only to own request" on storage.objects for insert to authenticated
 with check(bucket_id='request-attachments' and owner_id=auth.uid()::text and public.m3_is_owner(public.m3_storage_parent(name))
 and exists(select 1 from public.requests where request_id=public.m3_storage_parent(name) and attachment_reference is null));
create policy "Read linked authorised attachment" on storage.objects for select to authenticated
 using(bucket_id='request-attachments' and exists(select 1 from public.requests r
 where r.attachment_reference=name and public.m3_can_read(r.request_id)));
create policy "Read own staged upload" on storage.objects for select to authenticated
 using(bucket_id='request-attachments' and owner_id=auth.uid()::text and public.m3_is_owner(public.m3_storage_parent(name)));
create policy "Remove own unlinked staged upload" on storage.objects for delete to authenticated
 using(bucket_id='request-attachments' and public.m3_is_owner(public.m3_storage_parent(name))
 and not exists(select 1 from public.requests r where r.attachment_reference=name));
create function public.m3_link_attachment(p_id uuid,p_name text) returns void
language plpgsql security definer set search_path=public as $$
declare r public.requests;
begin
 if not public.m3_is_owner(p_id) then raise exception 'Request unavailable' using errcode='42501'; end if;
 select * into r from public.requests where request_id=p_id for update;
 if r.attachment_reference is not null then raise exception 'An attachment is already linked'; end if;
 if public.m3_storage_parent(p_name) is distinct from p_id or not exists(select 1 from storage.objects
 where bucket_id='request-attachments' and name=p_name and owner_id=auth.uid()::text)
 then raise exception 'Attachment is not owned by this requester' using errcode='42501'; end if;
 update public.requests set attachment_reference=p_name,version=version+1 where request_id=p_id;
end; $$;
revoke all on function public.m3_link_attachment(uuid,text) from public,anon;
grant execute on function public.m3_link_attachment(uuid,text) to authenticated;
