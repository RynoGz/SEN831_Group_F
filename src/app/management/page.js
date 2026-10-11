import Management from '@/features/workflow/management';
export const metadata={title:'Service overview'};
export default function Page(){return <><div className="page-heading"><p className="eyebrow">Management</p><h1>Service overview</h1><p className="lead">Activity within your permitted scope.</p></div><Management/></>;}
