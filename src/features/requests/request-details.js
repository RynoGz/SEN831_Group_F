export default function RequestDetails({ request }) {
  return (
    <article className="panel">
      <div className="detail-top"><p className="eyebrow">{request.reference || request.id}</p><span className="status-badge">{request.status}</span></div>
      <h2>{request.title}</h2>
      <dl className="details-grid">
        <div><dt>Category</dt><dd>{request.category}</dd></div>
        <div><dt>Location</dt><dd>{request.location}</dd></div>
        <div><dt>Submitted</dt><dd><time dateTime={request.createdAt}>{new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Johannesburg" }).format(new Date(request.createdAt))} SAST</time></dd></div>
        <div><dt>Sensitive information</dt><dd>{request.sensitiveInformation ? "Yes" : "No"}</dd></div>
      </dl>
      <section className="description"><h3>Description</h3><p>{request.description}</p></section>
    </article>
  );
}
