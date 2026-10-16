"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight, Clock, BookOpen } from "lucide-react";
import { getExam } from "@/lib/exam";
import { useAuth } from "@/hooks/useAuth";
import { ExamLoading, ExamMessage } from "../../_components/ExamState";

export default function SubjectsPage() {
  const params = useParams();
  const router = useRouter();
  const exam = getExam(params.exam);
  const { user, loading } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  if (!exam)
    return <ExamMessage title="Exam not found">Choose an available exam to continue.</ExamMessage>;
  if (loading) return <ExamLoading />;
  if (!user)
    return (
      <ExamMessage title="Make this practice yours" signIn>
        Sign in to save your answers and see your progress after each mock.
      </ExamMessage>
    );
  const chosen = selected.filter((subject) => exam.subjects.includes(subject));
  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <Link
          href="/exams"
          className="mb-5 inline-block text-sm text-text-muted hover:underline dark:text-text-dark-muted"
        >
          ← All exams
        </Link>
        <p className="page-kicker">{exam.name} / mock setup</p>
        <h1 className="page-title">What are we practising?</h1>
        <p className="page-intro">
          Choose your subjects. We’ll bring together a balanced mix of available questions for your
          session.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
        <section className="dash-card">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">Your subjects</h2>
            <button
              onClick={() =>
                setSelected(chosen.length === exam.subjects.length ? [] : [...exam.subjects])
              }
              className="min-h-11 text-sm font-medium text-brand-teal hover:underline dark:text-brand-aqua"
            >
              {chosen.length === exam.subjects.length ? "Clear selection" : "Select all"}
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {exam.subjects.map((subject) => {
              const active = chosen.includes(subject);
              return (
                <label
                  key={subject}
                  className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors ${active ? "border-brand-teal bg-brand-teal/5 dark:border-brand-aqua dark:bg-brand-aqua/5" : "border-current/15 hover:bg-current/5"}`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() =>
                      setSelected((previous) =>
                        previous.includes(subject)
                          ? previous.filter((item) => item !== subject)
                          : [...previous, subject],
                      )
                    }
                    className="h-4 w-4 accent-teal-700"
                  />
                  <span className="flex-1">{subject}</span>
                  {active && (
                    <Check
                      aria-hidden="true"
                      className="h-4 w-4 text-brand-teal dark:text-brand-aqua"
                    />
                  )}
                </label>
              );
            })}
          </div>
        </section>
        <aside className="space-y-5">
          <div className="dash-card !p-5">
            <Clock
              aria-hidden="true"
              className="mb-4 h-5 w-5 text-brand-teal dark:text-brand-aqua"
            />
            <h2 className="font-semibold">A focused session</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted dark:text-text-dark-muted">
              {exam.mockDurationMinutes} minutes · Up to {exam.mockQuestionCount} questions. Your
              timer starts when the questions are ready and keeps running if you leave the page.
            </p>
            <p aria-live="polite" className="mt-5 text-sm font-medium">
              {chosen.length} {chosen.length === 1 ? "subject" : "subjects"} selected
            </p>
            <button
              disabled={!chosen.length}
              onClick={() => {
                const query = new URLSearchParams({ subjects: JSON.stringify(chosen) });
                router.push(`/exams/${exam.slug}/mock?${query}`);
              }}
              className="btn-primary mt-3 flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Start mock <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <Link
            href={`/exams/${exam.slug}/history`}
            className="flex min-h-11 items-center gap-2 text-sm text-brand-teal hover:underline dark:text-brand-aqua"
          >
            <BookOpen aria-hidden="true" className="h-4 w-4" />
            Prefer to study without a timer?
          </Link>
        </aside>
      </div>
    </div>
  );
}
