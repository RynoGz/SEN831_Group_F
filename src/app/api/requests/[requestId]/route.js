import { createSupabaseServerClient } from '@/lib/supabase/server';
import { detail, change } from '@/features/workflow/service';
import { failure, sameOrigin } from '@/features/workflow/http';
export async function GET(request, {
  params
}) {
  try {
    return Response.json(await detail(await createSupabaseServerClient(), (await params).requestId));
  } catch (e) {
    return failure(e);
  }
}
export async function PATCH(request, {
  params
}) {
  try {
    sameOrigin(request);
    return Response.json(await change(await createSupabaseServerClient(), (await params).requestId, await request.json()));
  } catch (e) {
    return failure(e);
  }
}
