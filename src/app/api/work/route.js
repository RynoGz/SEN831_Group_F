import { createSupabaseServerClient } from '@/lib/supabase/server';
import { listRequests } from '@/features/workflow/service';
import { failure } from '@/features/workflow/http';
export async function GET(request){try{
 const client=await createSupabaseServerClient();const params=Object.fromEntries(new URL(request.url).searchParams);
 return Response.json(await listRequests(client,{...params,own:false,summaryOnly:params.summaryOnly==='true'}));
}catch(e){return failure(e);}}
