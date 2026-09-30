import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getMyRequests() {
  const supabase = await createSupabaseServerClient();

  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError || !userData.user) {
    return [];
  }

  const { data: requester, error: requesterError } = await supabase
    .from("requesters")
    .select("requester_id")
    .eq("auth_user_id", userData.user.id)
    .single();

  if (requesterError || !requester) {
    return [];
  }

  const { data, error } = await supabase
    .from("requests")
    .select(`
      request_id,
      title,
      location,
      created_at,
      categories (name),
      statuses (name)
    `)
    .eq("requester_id", requester.requester_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load requests: ${error.message}`);
  }

  return data.map((request) => ({
    id: request.request_id,
    title: request.title,
    location: request.location,
    createdAt: request.created_at,
    category: request.categories?.name ?? "Unknown",
    status: request.statuses?.name ?? "Unknown",
  }));
}