import Link from 'next/link';
import RequestList from '@/features/workflow/request-list';
export const metadata={title:'My requests'};
export default function Page(){return <><div className="page-heading"><p className="eyebrow">Your activity</p><h1>My requests</h1><p className="lead">Follow your saved requests and their updates.</p><Link href="/requests/new">Submit a request</Link></div><RequestList/></>;}
