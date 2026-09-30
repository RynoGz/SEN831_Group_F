import RequestForm from "@/features/requests/request-form";
import { previewCategories, previewRequester } from "@/features/requests/preview-data";

export const metadata = { title: "New request" };

export default function NewRequestPage() {
  return (
    <div className="narrow">
      <div className="page-heading"><p className="eyebrow">Let us know</p><h1>New service request</h1><p className="lead">Share the details so the right people can help.</p></div>
      <RequestForm categories={previewCategories} requester={previewRequester} />
    </div>
  );
}
