import RequestWorkspace from '@/features/workflow/request-workspace';
export default async function Page({params}){const {requestId}=await params;return <RequestWorkspace key={requestId} requestId={requestId}/>;}
