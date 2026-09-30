import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: { default: "CivicConnect", template: "%s | CivicConnect" },
  description: "Community service requests, in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <header className="site-header">
          <div className="header-inner">
            <Link className="brand" href="/" aria-label="CivicConnect home">
              <span className="brand-mark" aria-hidden="true">C</span>
              CivicConnect
            </Link>
            <nav aria-label="Main navigation">
              <Link href="/requests/new">New request</Link>
              <Link href="/requests">My requests</Link>
            </nav>
          </div>
        </header>
<div className="preview-banner">
  <div className="container">
    <strong>Development environment</strong> — use fictional information for testing.
  </div>
</div>
        <main id="main" className="container main-content" tabIndex={-1}>{children}</main>
        <footer className="container site-footer">
          <span>CivicConnect</span><span>SEN381 · Milestone 2</span>
        </footer>
      </body>
    </html>
  );
}
