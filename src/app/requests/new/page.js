import RequestForm from "@/features/requests/request-form";
import { getCategories } from "@/features/requests/get-categories";
import { submitRequest } from "@/features/requests/submit-request";
import { getRequester } from "@/features/requests/get-requester";

export const metadata = {
  title: "New request",
};

export default async function NewRequestPage() {
  const [categories, requester] = await Promise.all([
  getCategories(),
  getRequester(),
]);

  return (
    <div className="narrow">
      <div className="page-heading">
        <p className="eyebrow">Let us know</p>
        <h1>New service request</h1>
        <p className="lead">
          Share the details so the right people can help.
        </p>
      </div>

      <RequestForm
  categories={categories}
  requester={requester}
  submitRequest={submitRequest}
/>
    </div>
  );
}