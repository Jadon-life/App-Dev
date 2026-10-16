"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, ArrowRight, Target, Clock, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { EXAMS, EXAM_SLUGS } from "@shared/constants/exams";

type Attempt = { id: string; score: number; started_at: string; completed_at: string | null; exam_id: string };
type Access = { exam_id: string };
type Exam = { id: string; slug: string };

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["student-dashboard", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [attempts, access, exams] = await Promise.all([
        supabase.from("mock_attempts").select("id,score,started_at,completed_at,exam_id")
          .eq("user_id", user!.id).order("started_at", { ascending: false }).limit(30),
        supabase.from("user_exam_access").select("exam_id").eq("user_id", user!.id),
        supabase.from("exams").select("id,slug").eq("is_active", true),
      ]);
      if (attempts.error) throw attempts.error;
      if (access.error) throw access.error;
      if (exams.error) throw exams.error;
      return {
        attempts: (attempts.data || []) as Attempt[],
        access: (access.data || []) as Access[],
        exams: (exams.data || []) as Exam[],
      };
    },
  });

  const completed = data?.attempts.filter((attempt) => !!attempt.completed_at) || [];
  const average = completed.length
    ? Math.round(completed.reduce((sum, attempt) => sum + attempt.score, 0) / completed.length)
    : null;
  const unlocked = new Set(data?.access.map((entry) => entry.exam_id) || []);
  const unlockedCount = (data?.exams || []).filter((exam) => unlocked.has(exam.id)).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="space-y-2 border-b border-brand-teal/10 pb-6 dark:border-brand-frost/10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-teal dark:text-brand-aqua">
          Your study space
        </p>
        <h1 className="font-heading text-3xl font-bold text-text-primary dark:text-text-dark-primary sm:text-4xl">
          Make your next attempt count.
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-text-muted dark:text-text-dark-muted">
          Prepare for the exams that matter. Practice, review your results, and focus on your next step.
        </p>
      </header>

      {authLoading || isLoading ? (
        <div role="status" aria-live="polite" className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-section bg-brand-teal/10 dark:bg-brand-frost/10" />
          ))}
          <span className="sr-only">Loading your study progress</span>
        </div>
      ) : isError ? (
        <section role="alert" className="rounded-section border border-red-300 p-6">
          <h2 className="font-semibold">Your progress could not be loaded.</h2>
          <p className="mt-1 text-sm">Check your connection and try again. Your saved attempts have not been changed.</p>
          <button type="button" onClick={() => refetch()} className="btn-secondary mt-4">Try again</button>
        </section>
      ) : (
        <>
          <section aria-label="Your real study activity" className="grid gap-4 sm:grid-cols-3">
            <div className="dash-card">
              <Target className="mb-4 h-5 w-5 text-brand-teal dark:text-brand-aqua" />
              <p className="text-sm text-text-muted dark:text-text-dark-muted">Average mock score</p>
              <p className="mt-1 text-3xl font-bold">{average === null ? "—" : `${average}%`}</p>
              <p className="mt-1 text-xs text-text-muted">{average === null ? "Finish a mock to see your average" : "From your completed mocks"}</p>
            </div>
            <div className="dash-card">
              <Clock className="mb-4 h-5 w-5 text-brand-teal dark:text-brand-aqua" />
              <p className="text-sm text-text-muted dark:text-text-dark-muted">Mocks completed</p>
              <p className="mt-1 text-3xl font-bold">{completed.length}</p>
              <p className="mt-1 text-xs text-text-muted">Recent saved attempts</p>
            </div>
            <div className="dash-card">
              <GraduationCap className="mb-4 h-5 w-5 text-brand-teal dark:text-brand-aqua" />
              <p className="text-sm text-text-muted dark:text-text-dark-muted">Exams unlocked</p>
              <p className="mt-1 text-3xl font-bold">{unlockedCount}</p>
              <p className="mt-1 text-xs text-text-muted">Available in your account</p>
            </div>
          </section>

          <section>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="font-heading text-xl font-bold">Choose your exam</h2>
                <p className="mt-1 text-sm text-text-muted dark:text-text-dark-muted">Pick up where you left off, or begin your first practice.</p>
              </div>
              <Link href="/exams" className="text-sm font-semibold text-brand-teal dark:text-brand-aqua">All exams →</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {EXAM_SLUGS.map((slug) => {
                const exam = EXAMS[slug];
                const record = data?.exams.find((item) => item.slug === slug);
                const owned = !!record && unlocked.has(record.id);
                return (
                  <article key={slug} className="dash-card flex flex-col justify-between gap-6">
                    <div>
                      <BookOpen className="mb-3 h-6 w-6 text-brand-teal dark:text-brand-aqua" />
                      <h3 className="text-xl font-bold">{exam.name}</h3>
                      <p className="mt-1 text-sm text-text-muted dark:text-text-dark-muted">{exam.fullName}</p>
                      <p className="mt-3 text-xs text-text-muted dark:text-text-dark-muted">
                        {exam.subjects.length} subjects · {exam.mockDurationMinutes}-minute mock
                      </p>
                    </div>
                    <Link href={owned ? `/exams/${slug}/subjects` : `/pay/${slug}`}
                      className="btn-primary w-full gap-2 text-sm">
                      {owned ? "Start a mock" : `Unlock for ${exam.priceFormatted}`}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="dash-card">
            <h2 className="font-heading text-lg font-bold">Recent results</h2>
            {completed.length ? (
              <ul className="mt-4 divide-y divide-brand-teal/10 dark:divide-brand-frost/10">
                {completed.slice(0, 5).map((attempt) => {
                  const exam = data?.exams.find((item) => item.id === attempt.exam_id);
                  return (
                    <li key={attempt.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div>
                        <p className="text-sm font-semibold">{exam?.slug?.toUpperCase() || "Mock exam"}</p>
                        <p className="text-xs text-text-muted dark:text-text-dark-muted">
                          {new Date(attempt.completed_at!).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <span className="text-lg font-bold">{attempt.score}%</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="py-8 text-center">
                <p className="font-medium">Your first result will appear here.</p>
                <p className="mt-2 text-sm text-text-muted dark:text-text-dark-muted">
                  Take a mock exam to start building a reliable picture of your progress.
                </p>
                <Link href="/exams" className="btn-secondary mt-5 text-sm">Explore exams</Link>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
