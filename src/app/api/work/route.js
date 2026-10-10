import { createSupabaseServerClient } from '@/lib/supabase/server';
import { listRequests,session } from '@/features/workflow/service';
import { failure } from '@/features/workflow/http';
export async function GET(request){try{
 const client=await createSupabaseServerClient();const params=Object.fromEntries(new URL(request.url).searchParams);
 const rows=await listRequests(client,{query:params.query,status:params.status,category:params.category,sort:params.sort});
 const actor=await session(client);
 const {data:staff,error}=actor.role==='manager'?await client.rpc('m3_staff_directory'):{data:[],error:null};
 if(error)throw error;
 return Response.json({requests:rows,staff,actor});
}catch(e){return failure(e);}}
