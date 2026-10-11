import RequestList from '@/features/workflow/request-list';
export const metadata={title:'Work queue'};
export default function Page(){return <><div className="page-heading"><p className="eyebrow">Service team</p><h1>Work queue</h1><p className="lead">Requests within your authorised categories and sensitivity clearance.</p></div><RequestList work/></>;}
