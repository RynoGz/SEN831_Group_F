import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getRequester() {
  const supabase = await createSupabaseServerClient();

  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError || !userData.user) {
    return null;
  }

  const { data: requester, error } = await supabase
    .from("requesters")
    .select("requester_id, full_name, email")
    .eq("auth_user_id", userData.user.id)
    .single();

  if (error || !requester) {
    return null;
  }

  return {
    id: requester.requester_id,
    displayName: requester.full_name,
    contact: requester.email,
  };
}