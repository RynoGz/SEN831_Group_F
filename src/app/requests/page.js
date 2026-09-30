import Link from "next/link";

export const metadata = { title: "My requests" };

export default function RequestsPage() {
  return (
    <div className="narrow">
      <div className="page-heading"><p className="eyebrow">Keep track</p><h1>My requests</h1><p className="lead">Your requests and their progress will appear here.</p></div>
      <section className="panel empty-state"><h2>Request history is not connected yet</h2><p>Sign-in and saved requests will be available after the server integration. No records have been loaded.</p><div className="actions"><Link className="button" href="/requests/new">Try the request form</Link><Link className="text-link" href="/requests/example">View a fictional example</Link></div></section>
    </div>
  );
}
