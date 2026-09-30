import Link from "next/link";
import RequestDetails from "@/features/requests/request-details";
import { exampleRequest } from "@/features/requests/preview-data";

export const metadata = { title: "Example request" };

export default function ExampleRequestPage() {
  return (
    <div className="narrow"><Link className="text-link" href="/requests">← My requests</Link><div className="page-heading"><p className="eyebrow">Fictional example</p><h1>Request details</h1><p className="lead">This demonstrates the details screen. It is not a submitted request.</p></div><RequestDetails request={exampleRequest} /></div>
  );
}
