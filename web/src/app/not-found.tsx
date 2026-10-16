import Link from "next/link";
export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <p className="page-kicker">Page not found</p>
      <h1 className="display-title text-5xl">Let’s find your place.</h1>
      <p className="page-intro">
        This page may have moved, or the link may be incomplete. Your study space is still here.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/dashboard" className="btn-primary">
          Go to your study space
        </Link>
        <Link href="/home" className="btn-secondary">
          CrysLearn home
        </Link>
      </div>
    </main>
  );
}
