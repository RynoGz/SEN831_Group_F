import { createSupabaseServerClient } from '@/lib/supabase/server';
import { session } from '@/features/workflow/service';
import { failure, sameOrigin } from '@/features/workflow/http';
export async function GET() {
  try {
    return Response.json(await session(await createSupabaseServerClient()));
  } catch (e) {
    return failure(e);
  }
}
export async function DELETE(request) {
  try {
    sameOrigin(request);
    const client = await createSupabaseServerClient();
    await session(client);
    const {
      error
    } = await client.auth.signOut();
    if (error) throw error;
    return Response.json({
      ok: true
    });
  } catch (e) {
    return failure(e);
  }
}
