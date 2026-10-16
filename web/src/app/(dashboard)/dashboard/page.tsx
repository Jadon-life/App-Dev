"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { summarizeAttempts } from "@/lib/study-progress";
import { EXAMS } from "@shared/constants/exams";
import type { ExamSlug } from "@/types/database";

interface RecentAttempt {
  id: string;
  score: number;
  completed_at: string | null;
  exams: { name: string; slug: ExamSlug } | null;
}

function PaymentNotice() {
  const paymentStatus = useSearchParams().get("payment");
  if (paymentStatus !== "failed" && paymentStatus !== "error") return null;
  return (
    <section className="dash-card border-warning/40" aria-label="Payment status">
      <p
        role="alert"
        className="text-sm leading-relaxed text-text-primary dark:text-text-dark-primary"
      >
        {paymentStatus === "failed"
          ? "We could not confirm a valid payment for this account. Check your exam access before trying again. If you were charged, keep your payment reference."
          : "We could not verify your payment. Check your exam access before paying again. If you were charged, keep your payment reference."}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Link href="/exams" className="btn-secondary">
          Check exam access
        </Link>
        <Link
          href="/dashboard"
          replace
          scroll={false}
          className="inline-flex min-h-touch items-center text-sm text-text-muted dark:text-text-dark-muted"
        >
          Dismiss
        </Link>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { profile } = useProfile();
  const attemptsQuery = useQuery({
    queryKey: ["dashboard-attempts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return { attempts: [] as RecentAttempt[], count: 0 };
      const { data, count, error } = await supabase
        .from("mock_attempts")
        .select("id, score, completed_at, exams(name, slug)", { count: "exact" })
        .eq("user_id", user.id)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return { attempts: (data || []) as unknown as RecentAttempt[], count: count ?? 0 };
    },
  });
  const summary = summarizeAttempts(attemptsQuery.data?.attempts || []);
  const firstName = profile?.name?.trim().split(/\s+/)[0];

  return (
    <div className="space-y-8">
      <Suspense fallback={null}>
        <PaymentNotice />
      </Suspense>
      <header className="flex flex-wrap items-end justify-between gap-5 border-b border-brand-teal/15 pb-7 dark:border-brand-frost/15">
        <div>
          <p className="page-kicker">Your study desk</p>
          <h1 className="page-title">
            {firstName ? `${firstName}, keep moving forward.` : "One topic closer to exam day."}
          </h1>
          <p className="page-intro mt-3">
            Practise with purpose. Review what you miss. Build confidence one session at a time.
          </p>
        </div>
        <Link href="/exams" className="btn-primary gap-2">
          Start practising
          <ArrowRight size={17} />
        </Link>
      </header>
      {!loading && !user ? (
        <section className="dash-card">
          <h2 className="font-heading text-2xl font-bold text-text-primary dark:text-text-dark-primary">
            Your progress belongs here.
          </h2>
          <p className="page-intro mt-3">
            Sign in to save mock results and see how your preparation is taking shape.
          </p>
          <Link href="/login" className="btn-secondary mt-5">
            Sign in to your account
          </Link>
        </section>
      ) : (
        <section aria-labelledby="progress-title">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2
              id="progress-title"
              className="font-heading text-xl font-bold text-text-primary dark:text-text-dark-primary"
            >
              The work you&apos;ve put in
            </h2>
            <p className="text-xs text-text-muted dark:text-text-dark-muted">
              Scores reflect your latest 20 completed mocks.
            </p>
          </div>
          {loading || attemptsQuery.isLoading ? (
            <p role="status" className="dash-card page-intro">
              Loading your results…
            </p>
          ) : attemptsQuery.isError ? (
            <div className="dash-card">
              <p role="alert" className="text-sm text-danger">
                Your results could not be loaded. Your saved progress has not been changed.
              </p>
              <button className="btn-secondary mt-4" onClick={() => void attemptsQuery.refetch()}>
                Try again
              </button>
            </div>
          ) : (
            <>
              <dl className="grid grid-cols-1 divide-y divide-brand-teal/15 border-y border-brand-teal/15 dark:divide-brand-frost/15 dark:border-brand-frost/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {[
                  {
                    label: "Completed mocks",
                    value: attemptsQuery.data?.count ?? 0,
                    icon: CheckCircle2,
                  },
                  {
                    label: "Recent average",
                    value: summary.average === null ? "—" : `${summary.average}%`,
                    icon: Target,
                  },
                  {
                    label: "Recent best",
                    value: summary.best === null ? "—" : `${summary.best}%`,
                    icon: BookOpen,
                  },
                ].map((stat) => (
                  <div key={stat.label} className="px-2 py-6 sm:px-6">
                    <dt className="flex items-center gap-2 text-sm text-text-muted dark:text-text-dark-muted">
                      <stat.icon size={16} />
                      {stat.label}
                    </dt>
                    <dd className="mt-3 font-heading text-4xl font-bold tracking-tight text-text-primary dark:text-text-dark-primary">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
              {summary.completed.length === 0 ? (
                <p className="mt-5 text-sm text-text-muted dark:text-text-dark-muted">
                  Your first completed mock will start the story. Choose an exam below when
                  you&apos;re ready.
                </p>
              ) : (
                <div className="mt-6 divide-y divide-brand-teal/10 dark:divide-brand-frost/10">
                  {summary.completed.slice(0, 5).map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between gap-4 py-4">
                      <div>
                        <p className="font-medium text-text-primary dark:text-text-dark-primary">
                          {attempt.exams?.name || "Mock exam"}
                        </p>
                        <p className="mt-1 text-xs text-text-muted dark:text-text-dark-muted">
                          {new Date(attempt.completed_at!).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-heading text-xl font-bold text-text-primary dark:text-text-dark-primary">
                          {attempt.score}%
                        </span>
                        {attempt.exams?.slug && EXAMS[attempt.exams.slug] && (
                          <Link
                            href={`/exams/${attempt.exams.slug}/results?attempt=${encodeURIComponent(attempt.id)}`}
                            aria-label={`Review ${attempt.exams.name} result`}
                            className="btn-secondary px-3"
                          >
                            <ArrowRight size={16} />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      )}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="dash-card">
          <p className="page-kicker">Make your next move</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-text-primary dark:text-text-dark-primary">
            Good preparation has a rhythm.
          </h2>
          <div className="mt-6 space-y-5">
            {[
              {
                number: "01",
                title: "Work through past questions",
                body: "Find your footing in a subject, then review the explanation behind each answer.",
                href: "/past-questions",
              },
              {
                number: "02",
                title: "Test yourself against the clock",
                body: "Use a timed mock to practise focus and discover what needs another look.",
                href: "/exams",
              },
            ].map((step) => (
              <Link key={step.number} href={step.href} className="group flex items-start gap-4">
                <span className="pt-1 font-mono text-xs text-brand-teal dark:text-brand-surf">
                  {step.number}
                </span>
                <div className="flex-1">
                  <h3 className="font-medium text-text-primary group-hover:text-brand-teal dark:text-text-dark-primary dark:group-hover:text-brand-surf">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted dark:text-text-dark-muted">
                    {step.body}
                  </p>
                </div>
                <ArrowRight
                  size={17}
                  className="mt-1 shrink-0 text-text-muted dark:text-text-dark-muted"
                />
              </Link>
            ))}
          </div>
        </section>
        <section className="dash-card flex flex-col items-start">
          <CalendarDays
            className="mb-6 text-brand-teal dark:text-brand-surf"
            size={27}
            strokeWidth={1.5}
          />
          <h2 className="font-heading text-2xl font-bold text-text-primary dark:text-text-dark-primary">
            Give your week a plan.
          </h2>
          <p className="page-intro mb-6 mt-3">
            A few focused sessions can be easier to keep than a long list of good intentions.
          </p>
          <Link href="/schedule" className="btn-secondary mt-auto gap-2">
            Plan your study week
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
