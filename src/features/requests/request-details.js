import { createSupabaseServerClient } from "@/lib/supabase/server";

export default function RequestDetails({ request }) {
  const statusHistory = request.statusHistory ?? [];

  return (
    <>
      <div className="form-card">
        <p>
          <strong>Category:</strong> {request.category}
        </p>
        <p>
          <strong>Location:</strong> {request.location}
        </p>
        <p>
          <strong>Submitted:</strong>{" "}
          {new Date(request.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Sensitive information:</strong>{" "}
          {request.sensitiveInformation ? "Yes" : "No"}
        </p>
      </div>

      <div className="form-card">
        <h2>Status history</h2>
        {statusHistory.length === 0 ? (
          <p>No status history is available.</p>
        ) : (
          <ul>
            {statusHistory.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.status}</strong>{" "}
                <span aria-hidden="true">—</span>{" "}
                {new Date(entry.changedAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export async function getRequestDetails(requestId) {
  const supabase = await createSupabaseServerClient();

  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError || !userData.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("requests")
    .select(`
      request_id,
      title,
      description,
      location,
      sensitive_information,
      attachment_reference,
      created_at,
      categories (name),
      statuses (name),
      status_history (
        status_history_id,
        changed_at,
        statuses (name)
      )
    `)
    .eq("request_id", requestId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.request_id,
    title: data.title,
    description: data.description,
    location: data.location,
    sensitiveInformation: data.sensitive_information,
    attachmentReference: data.attachment_reference,
    createdAt: data.created_at,
    category: data.categories?.name ?? "Unknown",
    status: data.statuses?.name ?? "Unknown",
    statusHistory: (data.status_history ?? []).map((item) => ({
      id: item.status_history_id,
      status: item.statuses?.name ?? "Unknown",
      changedAt: item.changed_at,
    })),
  };
}
