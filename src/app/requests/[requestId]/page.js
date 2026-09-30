import Link from "next/link";
import { getRequestDetails } from "@/features/requests/request-details";

export default async function RequestDetailsPage({ params }) {
  const { requestId } = await params;
  const request = await getRequestDetails(requestId);

  if (!request) {
    return (
      <div className="narrow">
        <div className="page-heading">
          <p className="eyebrow">Request not found</p>
          <h1>We could not find that request.</h1>
        </div>

        <Link href="/requests">Back to my requests</Link>
      </div>
    );
  }

  return (
    <div className="narrow">
      <div className="page-heading">
        <p className="eyebrow">{request.status}</p>
        <h1>{request.title}</h1>
        <p className="lead">{request.description}</p>
      </div>

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

        {request.statusHistory.length === 0 ? (
          <p>No status history is available.</p>
        ) : (
<ul>
  {request.statusHistory.map((entry) => (
    <li key={entry.id}>
      <strong>{entry.status}</strong>{" "}
      <span aria-hidden="true">—</span>{" "}
      {new Date(entry.changedAt).toLocaleString()}
    </li>
  ))}
</ul>
        )}
      </div>

      <Link href="/requests">Back to my requests</Link>
    </div>
  );
}