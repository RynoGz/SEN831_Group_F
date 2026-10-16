-- Apply after 007. Preserve the existing workflow, data and RPC permissions.
-- Business version conflicts must not use retryable serialization code 40001.
begin;

do $migration$
declare
 definition text := pg_get_functiondef(
  'public.m3_change_request(uuid,integer,text,text,uuid,text,boolean,timestamp with time zone)'::regprocedure
 );
 old_code text := 'errcode=''40001''';
 new_code text := 'errcode=''PT409''';
begin
 if position(old_code in definition)=0 then
  if position(new_code in definition)>0 then return; end if;
  raise exception 'Expected version-conflict guard not found; inspect m3_change_request before applying this migration';
 end if;
 if (length(definition)-length(replace(definition,old_code,'')))/length(old_code)<>1 then
  raise exception 'Expected exactly one version-conflict guard; migration cancelled';
 end if;
 execute replace(definition,old_code,new_code);
end;
$migration$;

notify pgrst, 'reload schema';
commit;
