import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Your community, connected</p>
        <h1>A better place starts<br />with a request.</h1>
        <p className="lead">Report a service issue and give the people who can help the details they need.</p>
        <div className="actions">
          <Link className="button" href="/requests/new">Create a request <span aria-hidden="true">↗</span></Link>
          <Link className="text-link" href="/requests/example">View an example request</Link>
        </div>
      </section>
      <section aria-labelledby="how-heading" className="how-section">
        <h2 id="how-heading">A clear path from issue to action</h2>
        <p className="muted">The service workflow we are building.</p>
        <ol className="steps">
          <li><span className="step-number">01</span><h3>Tell us what happened</h3><p>Add the category, location and details that will help someone understand the issue.</p></li>
          <li><span className="step-number">02</span><h3>Know it was received</h3><p>Once submission is connected, a saved request will receive a reference and confirmation.</p></li>
          <li><span className="step-number">03</span><h3>Follow the progress</h3><p>Authorised request details will show the current status and relevant updates.</p></li>
        </ol>
      </section>
    </>
  );
}
