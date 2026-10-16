"use client";

import { Suspense, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, RotateCcw, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getExam, isUuid, type ReviewedQuestion } from "@/lib/exam";
import { examRequest, type AttemptPayload } from "@/lib/exam-client";
import { ExamLoading, ExamMessage } from "../../_components/ExamState";

function ResultsContent() {
  const params = useParams();
  const search = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const exam = getExam(params.exam);
  const id = search.get("attempt");
  const result = useQuery({
    queryKey: ["exam-result", user?.id, exam?.slug, id],
    queryFn: ({ signal }) =>
      examRequest<AttemptPayload>(`/api/exams/${exam!.slug}/attempts/${id}`, { signal }),
    enabled: !!user && !!exam && isUuid(id),
    retry: 1,
  });
  const reviewed = useMemo(
    () => (result.data?.attempt.completed_at ? (result.data.questions as ReviewedQuestion[]) : []),
    [result.data],
  );
  const subjects = useMemo(() => {
    const scores = new Map<string, { correct: number; total: number }>();
    for (const question of reviewed) {
      const score = scores.get(question.subject) ?? { correct: 0, total: 0 };
      score.total += 1;
      if (question.is_correct) score.correct += 1;
      scores.set(question.subject, score);
    }
    return [...scores.entries()];
  }, [reviewed]);
  if (!exam || !isUuid(id))
    return (
      <ExamMessage title="This result link is incomplete">
        Open a saved attempt from your dashboard, or finish a mock to see your result.
      </ExamMessage>
    );
  if (authLoading) return <ExamLoading />;
  if (!user)
    return (
      <ExamMessage title="Your results belong to you" signIn>
        Sign in to securely open your saved attempt.
      </ExamMessage>
    );
  if (result.isLoading) return <ExamLoading message="Opening your saved result…" />;
  if (result.isError)
    return (
      <ExamMessage title="We couldn’t open this result" retry={() => void result.refetch()}>
        {result.error instanceof Error ? result.error.message : "Please try again."}
      </ExamMessage>
    );
  if (result.data && !result.data.attempt.completed_at)
    return (
      <ExamMessage title="This mock hasn’t been submitted">
        Your answers are saved.{" "}
        <Link
          className="font-semibold underline"
          href={`/exams/${exam.slug}/mock?${new URLSearchParams({ subjects: JSON.stringify(result.data.attempt.subjects), attempt: result.data.attempt.id })}`}
        >
          Return to the mock
        </Link>{" "}
        to finish it and see your result.
      </ExamMessage>
    );
  if (!reviewed.length || !result.data)
    return (
      <ExamMessage title="No review available">
        There are no questions to review for this attempt.
      </ExamMessage>
    );
  const correct = reviewed.filter((question) => question.is_correct).length;
  const unanswered = reviewed.filter((question) => !question.user_answer).length;
  const score = result.data.attempt.score;

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-7">
        <p className="page-kicker">{exam.name} / your result</p>
        <h1 className="page-title">Every attempt teaches you something.</h1>
        <p className="page-intro">
          Your result is saved. Take a closer look at the questions, then use what you’ve learned in
          your next session.
        </p>
      </header>
      <section className="dash-card mb-6 !p-6 sm:!p-8">
        <div className="flex flex-wrap items-center gap-7 border-b border-current/10 pb-7">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[6px] border-brand-teal/20 dark:border-brand-aqua/20">
            <span className="font-heading text-4xl font-bold text-brand-teal dark:text-brand-aqua">
              {score}
              <span className="text-lg">%</span>
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {correct} of {reviewed.length} correct
            </h2>
            <p className="mt-2 text-sm text-text-muted dark:text-text-dark-muted">
              {reviewed.length - correct - unanswered} incorrect · {unanswered} unanswered
            </p>
            <p className="mt-2 text-xs text-text-muted dark:text-text-dark-muted">
              Completed{" "}
              {new Intl.DateTimeFormat("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(new Date(result.data.attempt.completed_at!))}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/exams/${exam.slug}/subjects`}
            className="btn-primary flex items-center gap-2"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Practise again
          </Link>
          <Link href="/dashboard" className="btn-secondary flex items-center gap-2">
            Your dashboard
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <section className="dash-card mb-8">
        <h2 className="mb-6 text-lg font-semibold">A closer look by subject</h2>
        <div className="space-y-5">
          {subjects.map(([subject, counts]) => {
            const percentage = Math.round((counts.correct / counts.total) * 100);
            return (
              <div key={subject}>
                <div className="mb-2 flex flex-wrap justify-between gap-2 text-sm">
                  <span>{subject}</span>
                  <span className="text-text-muted dark:text-text-dark-muted">
                    {counts.correct} / {counts.total} · {percentage}%
                  </span>
                </div>
                <div
                  role="meter"
                  aria-label={`${subject} correct answers`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percentage}
                  className="h-1.5 overflow-hidden rounded-full bg-current/10"
                >
                  <div
                    className="h-full rounded-full bg-brand-teal dark:bg-brand-aqua"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section aria-labelledby="review-title">
        <div className="mb-5">
          <h2 id="review-title" className="text-xl font-semibold">
            Review your answers
          </h2>
          <p className="mt-1 text-sm text-text-muted dark:text-text-dark-muted">
            Open a question to see the answer and explanation.
          </p>
        </div>
        <div className="space-y-3">
          {reviewed.map((question, index) => (
            <details key={question.id} className="dash-card group !p-0">
              <summary className="flex min-h-20 cursor-pointer list-none items-start gap-3 p-5 sm:p-6">
                {question.is_correct ? (
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-brand-teal dark:text-brand-aqua"
                  />
                ) : (
                  <XCircle
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-red-700 dark:text-red-300"
                  />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium leading-relaxed">
                    {index + 1}. {question.question_text}
                  </span>
                  <span className="mt-2 block text-xs text-text-muted dark:text-text-dark-muted">
                    {question.subject} ·{" "}
                    {question.is_correct
                      ? "Correct"
                      : question.user_answer
                        ? "Incorrect"
                        : "Unanswered"}
                  </span>
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="border-t border-current/10 p-5 sm:p-6">
                <ul className="space-y-2">
                  {question.options.map((option) => {
                    const isCorrect = option.label === question.correct_option;
                    const isChosen = option.label === question.user_answer;
                    return (
                      <li
                        key={option.label}
                        className={`rounded-lg px-4 py-3 text-sm leading-relaxed ${isCorrect ? "bg-brand-teal/10 text-brand-teal dark:text-brand-aqua" : isChosen ? "bg-red-500/10 text-red-800 dark:text-red-200" : "bg-current/[0.025]"}`}
                      >
                        <span className="mr-3 font-mono font-semibold">{option.label}.</span>
                        {option.text}
                        {isCorrect && (
                          <span className="ml-2 text-xs font-semibold">✓ Correct answer</span>
                        )}
                        {isChosen && (
                          <span className="ml-2 text-xs font-semibold">Your answer</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {!question.user_answer && (
                  <p className="mt-3 text-xs text-text-muted dark:text-text-dark-muted">
                    You didn’t answer this question.
                  </p>
                )}
                <div className="mt-4 rounded-xl border border-current/10 p-4">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider">
                    Why this answer?
                  </h3>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-text-muted dark:text-text-dark-muted">
                    {question.explanation ||
                      "An explanation hasn’t been added for this question yet."}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
export default function ResultsPage() {
  return (
    <Suspense fallback={<ExamLoading />}>
      <ResultsContent />
    </Suspense>
  );
}
