"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, ShieldCheck, UsersRound } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

export default function ParentDashboardPage() {
  const { profile, loading, error, refetch } = useProfile();

  if (loading)
    return (
      <p role="status" className="page-intro py-10">
        Loading your account…
      </p>
    );
  if (error)
    return (
      <div className="dash-card max-w-xl">
        <p role="alert" className="text-sm text-danger">
          Your account details could not be loaded.
        </p>
        <button className="btn-secondary mt-4" onClick={() => void refetch()}>
          Try again
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl space-y-7">
      <header>
        <p className="page-kicker">Support, without pressure</p>
        <h1 className="page-title">A little encouragement goes a long way.</h1>
        <p className="page-intro mt-3">
          Help your student make time for the work and recognise the progress they&apos;re making.
        </p>
      </header>
      <section className="dash-card grid gap-6 sm:grid-cols-[auto_1fr]">
        <ShieldCheck size={30} strokeWidth={1.5} className="text-brand-teal dark:text-brand-surf" />
        <div>
          <h2 className="font-heading text-2xl font-bold text-text-primary dark:text-text-dark-primary">
            Student progress stays private.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-muted dark:text-text-dark-muted">
            Parent account linking is not available yet. A student approval process is needed before
            another account can view their results. Entering a student ID will not grant access.
          </p>
          {profile?.linked_student_id && (
            <p className="mt-3 text-sm leading-relaxed text-text-muted dark:text-text-dark-muted">
              An earlier link exists on this account. Results are not displayed here while
              student-approved sharing is unavailable.
            </p>
          )}
          <p className="mt-4 text-sm font-medium text-text-primary dark:text-text-dark-primary">
            For now, ask your student to walk you through their results together on their own
            account.
          </p>
        </div>
      </section>
      <div className="grid gap-6 sm:grid-cols-2">
        <section className="border-t border-brand-teal/15 pt-6 dark:border-brand-frost/15">
          <CalendarDays size={23} className="text-brand-teal dark:text-brand-surf" />
          <h2 className="mt-4 font-heading text-xl font-bold text-text-primary dark:text-text-dark-primary">
            Build a workable routine.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted dark:text-text-dark-muted">
            Agree on a few focused sessions each week. Leave space for breaks and subjects that need
            extra attention.
          </p>
          <Link
            href="/schedule"
            className="mt-5 inline-flex min-h-touch items-center gap-2 text-sm font-semibold text-brand-teal dark:text-brand-surf"
          >
            Open your planner
            <ArrowRight size={16} />
          </Link>
        </section>
        <section className="border-t border-brand-teal/15 pt-6 dark:border-brand-frost/15">
          <UsersRound size={23} className="text-brand-teal dark:text-brand-surf" />
          <h2 className="mt-4 font-heading text-xl font-bold text-text-primary dark:text-text-dark-primary">
            Talk about the process.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted dark:text-text-dark-muted">
            Ask which topic felt clearer today and which one needs another try. A mock score is a
            useful starting point for that conversation.
          </p>
          <Link
            href="/settings"
            className="mt-5 inline-flex min-h-touch items-center gap-2 text-sm font-semibold text-brand-teal dark:text-brand-surf"
          >
            Account settings
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
