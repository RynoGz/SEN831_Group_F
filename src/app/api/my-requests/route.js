import { createSupabaseServerClient } from '@/lib/supabase/server';
import { listRequests } from '@/features/workflow/service';
import { failure } from '@/features/workflow/http';
export async function GET(){try{return Response.json({requests:await listRequests(await createSupabaseServerClient(),{own:true})});}catch(e){return failure(e);}}
