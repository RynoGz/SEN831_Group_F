import Link from 'next/link';
import RequestList from '@/features/workflow/request-list';
export const metadata={title:'My requests'};
export default function Page(){return <><div className="page-heading"><h1>Your Workspace</h1><Link className="button" href="/requests/new">Create a request</Link></div><RequestList/></>;}
