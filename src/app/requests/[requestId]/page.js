import RequestWorkspace from '@/features/workflow/request-workspace';
export default async function Page({params}){return <RequestWorkspace requestId={(await params).requestId}/>;}
