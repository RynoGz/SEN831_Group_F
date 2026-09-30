"use client";

export default function ErrorPage({ reset }) {
  return <section className="narrow panel" role="alert"><h1>Something went wrong</h1><p>We could not load this page. Please try again.</p><button className="button" onClick={() => reset()}>Try again</button></section>;
}
