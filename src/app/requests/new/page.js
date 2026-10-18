import RequestForm from '@/features/requests/request-form';
import { getCategories } from '@/features/requests/get-categories';
import { submitRequest } from '@/features/requests/submit-request';
import { getRequester } from '@/features/requests/get-requester';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { MAX_ATTACHMENT_BYTES } from '@/features/attachments/attachment-store';
export const metadata={title:'New request'};
export default async function NewRequestPage(){
 const [categories,requester]=await Promise.all([getCategories(),getRequester()]);
 if (!requester) {
  const client = await createSupabaseServerClient();
  const { data, error } = await client.auth.getUser();
  if (!data?.user) {
   if (error && error.status >= 500) throw new Error('Sign-in could not be checked. Please try again.');
   redirect('/auth/login?next=/requests/new');
  }
  return <section className="panel narrow"><h1>Requester profile needed</h1><p>This account is not set up to submit requests. Ask the project team to add a requester profile for your account.</p><Link className="text-link" href="/">Return home</Link></section>;
 }
 return <><div className="page-heading"><h1>New Request</h1></div><div className="content-columns"><RequestForm categories={categories} requester={requester} submitRequest={submitRequest}/><aside className="request-guide"><p className="eyebrow">A helpful request</p><h2>Clear details.<br/>A better starting point.</h2><h3>Be specific</h3><p>Tell us what is wrong and where it is happening.</p><h3>Choose the closest category</h3><p>This helps the service team review your request.</p><div className="guide-rule"><h3>Have a photo or document?</h3><p>You can attach one PDF, PNG or JPEG after the request is saved. Maximum size: {MAX_ATTACHMENT_BYTES / (1024 * 1024)} MiB.</p></div><div className="guide-rule"><h3>What happens next?</h3><p>Your request starts as Submitted. The team reviews it and updates its status.</p></div></aside></div></>;
}
