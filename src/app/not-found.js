import Link from "next/link";

export default function NotFound() {
  return <section className="narrow panel"><h1>Page not found</h1><p>The page may have moved, or the address may be incorrect.</p><Link className="button" href="/">Return home</Link></section>;
}
