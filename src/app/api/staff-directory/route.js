
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { staffDirectory } from '@/features/workflow/service';
import { failure } from '@/features/workflow/http';

export async function GET(request) {
  try {
    const requestId = new URL(request.url).searchParams.get('requestId');

    const client = await createSupabaseServerClient();
    const result = await staffDirectory(client, requestId);

    return Response.json(result);
  } catch (error) {
    return failure(error);
  }
}
