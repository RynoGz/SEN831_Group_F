import Link from "next/link";

export const metadata = { title: "Request unavailable" };

// Do not load a request until Steven's authenticated, authorised query exists.
export default function RequestPage() {
  return <div className="narrow panel"><h1>Request details are not connected yet</h1><p>We cannot retrieve a saved request in this frontend preview.</p><Link className="text-link" href="/requests">Return to my requests</Link></div>;
}
