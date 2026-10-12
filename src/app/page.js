import Link from 'next/link';
import CommunityScene from '@/components/community-scene';
export default function HomePage() {
 return <><section className="hero"><div><h1>Small requests.<br /><span>Better places.</span></h1><p className="lead">Something needs attention? Tell us what happened, then follow your request from the first report to the final update.</p><div className="actions"><Link className="button" href="/requests/new">Create a request</Link></div></div><CommunityScene /></section>
 <section aria-labelledby="how-heading" className="how-section"><h2 id="how-heading">A simple way<br />to get things moving.</h2><ol className="steps"><li><h3>Tell us what happened</h3><p>Describe the issue and where to find it. The right details help the team get started.</p></li><li><h3>Know it was received</h3><p>Get confirmation that your request has been saved and is ready for review.</p></li><li><h3>Stay in the loop</h3><p>See status changes and public updates as your request moves forward.</p></li></ol></section></>;
}
