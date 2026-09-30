import Link from "next/link";
import { getMyRequests } from "@/features/requests/get-my-requests";

export const metadata = {
  title: "My requests",
};

export default async function RequestsPage() {
  const requests = await getMyRequests();

  return (
    <div className="narrow">
      <div className="page-heading">
        <p className="eyebrow">Your activity</p>
        <h1>My requests</h1>
        <p className="lead">
          View the service requests submitted from your account.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="form-card">
          <p>You have not submitted any requests yet.</p>
          <Link href="/requests/new">Submit a request</Link>
        </div>
      ) : (
        <div className="request-list">
          {requests.map((request) => (
            <article className="form-card" key={request.id}>
              <p className="eyebrow">{request.status}</p>
              <h2>{request.title}</h2>
              <p>{request.category}</p>
              <p>{request.location}</p>
              <p>
                Submitted:{" "}
                {new Date(request.createdAt).toLocaleString()}
              </p>

              <Link href={`/requests/${request.id}`}>
                View request
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}