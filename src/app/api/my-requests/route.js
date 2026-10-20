import { createSupabaseServerClient } from '@/lib/supabase/server';
import { listRequests } from '@/features/workflow/service';
import { failure } from '@/features/workflow/http';
export async function GET(request) {
  try {
    const params = Object.fromEntries(new URL(request.url).searchParams);
    return Response.json(await listRequests(await createSupabaseServerClient(), {
      ...params,
      own: true,
      summaryOnly: false
    }));
  } catch (e) {
    return failure(e);
  }
}
