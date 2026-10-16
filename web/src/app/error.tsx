"use client";
import Link from "next/link";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div role="alert" className="mx-auto max-w-2xl px-6 py-20">
      <p className="page-kicker">Something went wrong</p>
      <h1 className="page-title">Let’s try that again.</h1>
      <p className="page-intro">
        This page couldn’t finish loading. Retry, or return to your study space. Your saved results
        are kept in your account.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button className="btn-primary" onClick={reset}>
          Try again
        </button>
        <Link className="btn-secondary" href="/dashboard">
          Back to overview
        </Link>
      </div>
    </div>
  );
}
