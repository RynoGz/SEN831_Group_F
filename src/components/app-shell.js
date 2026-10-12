"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AccountNav from '@/features/workflow/account-nav';
import { useApi } from '@/features/workflow/use-api';

function Brand() {
  return <Link className="brand" href="/" aria-label="CivicConnect home"><span className="brand-mark" aria-hidden="true">C</span>CivicConnect</Link>;
}
export default function AppShell({ children }) {
  const pathname = usePathname();
  const { data: session } = useApi('/api/session');
  const workspace = pathname.startsWith('/requests') || pathname === '/work' || pathname === '/management';
  const team = ['staff', 'manager'].includes(session?.role);
  const links = [['/requests', 'My requests'], ['/requests/new', 'New request'], ...(team ? [['/work', 'Work queue']] : []), ...(session?.role === 'manager' ? [['/management', 'Overview']] : [])];
  const active = href => href === '/requests' ? pathname === href || (pathname.startsWith('/requests/') && pathname !== '/requests/new') : pathname === href;
  return <><a className="skip-link" href="#main">Skip to content</a>{workspace ? <div className="app-shell"><aside className="workspace-sidebar"><Brand /><nav aria-label="Main navigation"><span className="nav-caption">{team ? 'Service team' : 'Your workspace'}</span>{links.map(([href, label]) => <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined}>{label}</Link>)}</nav></aside><div className="workspace-body"><header className="workspace-header"><AccountNav session={session} workspace /></header><main id="main" className="workspace-content" tabIndex={-1}>{children}</main></div></div> : <div className="public-shell"><header className="site-header"><div className="header-inner"><Brand /><nav aria-label="Main navigation"><Link href="/requests">My requests</Link><AccountNav session={session} /></nav></div></header><main id="main" className="container main-content" tabIndex={-1}>{children}</main><footer className="container site-footer"><span>CivicConnect / Your community service portal</span></footer></div>}</>;
}
