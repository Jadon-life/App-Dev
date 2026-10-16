"use client";

import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Clock, ChevronLeft, ChevronRight, Send, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  getExam,
  isUuid,
  parseSubjects,
  remainingSeconds,
  readMockDraft,
  sanitizeAnswers,
  type PracticeQuestion,
} from "@/lib/exam";
import { examRequest, type AttemptPayload, type SavedAttempt } from "@/lib/exam-client";
import type { OptionLabel } from "@/types/database";
import { ExamLoading, ExamMessage } from "../../_components/ExamState";

function MockExamContent() {
  const params = useParams();
  const search = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const exam = getExam(params.exam);
  const slug = exam?.slug;
  const rawSubjects = search.get("subjects");
  const requestedAttempt = search.get("attempt");
  const subjects = useMemo(
    () => parseSubjects(rawSubjects, exam?.subjects ?? []),
    [rawSubjects, exam],
  );
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [attempt, setAttempt] = useState<SavedAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, OptionLabel>>({});
  const [index, setIndex] = useState(0);
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saveState, setSaveState] = useState("Answers save automatically");
  const answersRef = useRef(answers);
  const revisionRef = useRef(0);
  const submittingRef = useRef(false);
  const timeoutSubmitted = useRef(false);
  const submitRef = useRef<() => Promise<void>>(async () => {});
  const dialogRef = useRef<HTMLDialogElement>(null);
  const storageKey = user && slug ? `cryslearn:mock:${user.id}:${slug}:${subjects.join("|")}` : "";

  useEffect(() => {
    if (
      authLoading ||
      !user ||
      !slug ||
      !subjects.length ||
      (requestedAttempt && !isUuid(requestedAttempt))
    )
      return;
    let cancelled = false;
    setLoading(true);
    setError("");
    async function load() {
      try {
        let draft = readMockDraft(null);
        try {
          draft = readMockDraft(sessionStorage.getItem(storageKey));
        } catch {
          /* Storage may be unavailable in private browsing. */
        }
        if (requestedAttempt && draft.id !== requestedAttempt) draft = readMockDraft(null);
        const id = requestedAttempt || draft.id || crypto.randomUUID();
        try {
          sessionStorage.setItem(storageKey, JSON.stringify({ ...draft, id }));
        } catch {
          /* The saved server attempt remains usable. */
        }
        const created = requestedAttempt
          ? { id: requestedAttempt }
          : await examRequest<{ id: string }>(`/api/exams/${slug}/attempts`, {
              method: "POST",
              body: JSON.stringify({ id, subjects }),
            });
        if (!requestedAttempt) {
          if (!cancelled)
            router.replace(
              `/exams/${slug}/mock?${new URLSearchParams({ subjects: JSON.stringify(subjects), attempt: created.id })}`,
            );
          return;
        }
        const payload = await examRequest<AttemptPayload>(
          `/api/exams/${slug}/attempts/${created.id}`,
        );
        if (cancelled) return;
        if (payload.attempt.completed_at) {
          try {
            if (readMockDraft(sessionStorage.getItem(storageKey)).id === created.id)
              sessionStorage.removeItem(storageKey);
          } catch {
            /* Optional local cache. */
          }
          router.replace(`/exams/${slug}/results?attempt=${created.id}`);
          return;
        }
        const useLocal =
          draft.id === payload.attempt.id &&
          draft.revision > payload.attempt.answer_revision &&
          remainingSeconds(payload.attempt.expires_at) > 0;
        const restored = sanitizeAnswers(
          useLocal ? draft.answers : payload.attempt.answers,
          payload.questions,
        );
        revisionRef.current = useLocal ? draft.revision : payload.attempt.answer_revision;
        answersRef.current = restored;
        timeoutSubmitted.current = false;
        setQuestions(payload.questions);
        setAttempt(payload.attempt);
        setAnswers(restored);
        setIndex(0);
        setTime(remainingSeconds(payload.attempt.expires_at));
        setLoading(false);
      } catch (failure) {
        if (!cancelled) {
          setError(failure instanceof Error ? failure.message : "Your mock could not be opened.");
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [authLoading, user, slug, subjects, storageKey, retry, router, requestedAttempt]);

  const submit = useCallback(async () => {
    if (!attempt || !slug || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setError("");
    setShowConfirm(false);
    try {
      await examRequest(`/api/exams/${slug}/attempts/${attempt.id}`, {
        method: "POST",
        body: JSON.stringify({ answers: answersRef.current }),
      });
      try {
        if (readMockDraft(sessionStorage.getItem(storageKey)).id === attempt.id)
          sessionStorage.removeItem(storageKey);
      } catch {
        /* Optional local cache. */
      }
      router.replace(`/exams/${slug}/results?attempt=${attempt.id}`);
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Your answers could not be submitted. Please try again.",
      );
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, [attempt, slug, storageKey, router]);
  submitRef.current = submit;

  // Measure against a persisted deadline, so sleeping/background tabs never gain time.
  // The ref always uses the latest answers, including a selection just before expiry.
  useEffect(() => {
    if (loading || !attempt) return;
    const tick = () => {
      const left = remainingSeconds(attempt.expires_at);
      setTime(left);
      if (!left && !timeoutSubmitted.current) {
        timeoutSubmitted.current = true;
        void submitRef.current();
      }
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [loading, attempt]);

  useEffect(() => {
    if (loading || !attempt || !slug || !revisionRef.current || submitting) return;
    const revision = revisionRef.current;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ id: attempt.id, answers, revision }));
    } catch {
      /* Server autosave is still available. */
    }
    if (remainingSeconds(attempt.expires_at) === 0) return;
    setSaveState("Saving answers…");
    let cancelled = false;
    const timer = window.setTimeout(() => {
      examRequest(`/api/exams/${slug}/attempts/${attempt.id}`, {
        method: "PATCH",
        body: JSON.stringify({ answers, revision }),
      })
        .then(() => {
          if (!cancelled) setSaveState("All answers saved");
        })
        .catch(() => {
          if (!cancelled)
            setSaveState(
              "Connection interrupted. Keep this page open and retry submission if needed.",
            );
        });
    }, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [answers, attempt, slug, loading, submitting, storageKey]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (showConfirm && dialog && !dialog.open) dialog.showModal();
    if (!showConfirm && dialog?.open) dialog.close();
  }, [showConfirm]);

  if (!exam || !subjects.length || (requestedAttempt && !isUuid(requestedAttempt)))
    return (
      <ExamMessage title="Let’s set up your mock">
        Choose an available exam and at least one subject before starting.
      </ExamMessage>
    );
  if (authLoading) return <ExamLoading />;
  if (!user)
    return (
      <ExamMessage title="Your study space is waiting" signIn>
        Sign in to start a mock and save your progress.
      </ExamMessage>
    );
  if (loading) return <ExamLoading message="Preparing your questions and saved progress…" />;
  if (!questions.length || !attempt)
    return (
      <ExamMessage title="We couldn’t start this mock" retry={() => setRetry((value) => value + 1)}>
        {error || "No questions are available for your selection yet."}
      </ExamMessage>
    );
  const question = questions[index];
  const count = Object.keys(answers).length;
  const urgent = time < 300;
  const formatted = `${Math.floor(time / 60)
    .toString()
    .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="sticky top-[72px] z-20 mb-7 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-current/10 bg-[var(--surface)] p-4 shadow-sm">
        <div>
          <p className="text-xs text-text-muted dark:text-text-dark-muted">{exam.name} mock</p>
          <p className="mt-1 text-sm font-semibold">
            {count} of {questions.length} answered
          </p>
        </div>
        <div
          role="timer"
          aria-label={`${Math.floor(time / 60)} minutes and ${time % 60} seconds remaining`}
          className={`flex items-center gap-2 font-mono text-xl font-semibold ${urgent ? "text-red-700 dark:text-red-300" : ""}`}
        >
          <Clock aria-hidden="true" className="h-4 w-4" />
          {formatted}
        </div>
        <button
          disabled={submitting}
          onClick={() => (time ? setShowConfirm(true) : void submit())}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Send aria-hidden="true" className="h-4 w-4" />
          {submitting ? "Submitting…" : time ? "Finish mock" : "Retry submission"}
        </button>
      </div>
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-800 dark:text-red-200"
        >
          {error} Your answers are still available on this page.
        </div>
      )}
      {!time && (
        <p role="status" className="mb-5 text-sm text-text-muted dark:text-text-dark-muted">
          Time is up. Your mock is locked while we save your result. If the connection fails, use
          Retry submission.
        </p>
      )}
      <section className="dash-card !p-5 sm:!p-8" aria-labelledby="question-title">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted dark:text-text-dark-muted">
          <span>
            {question.subject} / {question.year}
          </span>
          <span className="font-mono">
            QUESTION {index + 1} / {questions.length}
          </span>
        </div>
        <fieldset disabled={submitting || !time}>
          <legend
            id="question-title"
            className="mb-7 whitespace-pre-line text-lg font-medium leading-relaxed sm:text-xl"
          >
            {question.question_text}
          </legend>
          <div className="space-y-3">
            {question.options.map((option) => {
              const selected = answers[question.id] === option.label;
              return (
                <label
                  key={option.label}
                  className={`flex min-h-16 cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${selected ? "border-brand-teal bg-brand-teal/5 dark:border-brand-aqua dark:bg-brand-aqua/5" : "border-current/15 hover:bg-current/5"}`}
                >
                  <input
                    type="radio"
                    name={`answer-${question.id}`}
                    value={option.label}
                    checked={selected}
                    onChange={() => {
                      const next = { ...answersRef.current, [question.id]: option.label };
                      answersRef.current = next;
                      revisionRef.current += 1;
                      setAnswers(next);
                    }}
                    className="h-4 w-4 shrink-0 accent-teal-700"
                  />
                  <span className="font-mono text-sm font-semibold">{option.label}</span>
                  <span className="flex-1 whitespace-pre-line text-sm leading-relaxed">
                    {option.text}
                  </span>
                  {selected && (
                    <CheckCircle2
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-brand-teal dark:text-brand-aqua"
                    />
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      </section>
      <div className="my-5 flex items-center justify-between gap-3">
        <button
          className="btn-secondary flex items-center gap-1 disabled:opacity-40"
          disabled={!index}
          onClick={() => setIndex((value) => value - 1)}
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Previous
        </button>
        <button
          className="btn-secondary flex items-center gap-1 disabled:opacity-40"
          disabled={index === questions.length - 1}
          onClick={() => setIndex((value) => value + 1)}
        >
          Next
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
      <p className="mb-5 text-xs text-text-muted dark:text-text-dark-muted">{saveState}</p>
      <nav aria-label="Jump to a question" className="dash-card">
        <h2 className="mb-4 text-sm font-semibold">Your question map</h2>
        <div className="flex flex-wrap gap-2">
          {questions.map((item, number) => (
            <button
              key={item.id}
              aria-current={index === number ? "step" : undefined}
              aria-label={`Question ${number + 1}, ${answers[item.id] ? "answered" : "unanswered"}${index === number ? ", current" : ""}`}
              onClick={() => setIndex(number)}
              className={`flex h-11 w-11 items-center justify-center rounded-lg border font-mono text-xs ${number === index ? "border-brand-teal bg-brand-teal text-white dark:border-brand-aqua dark:bg-brand-aqua dark:text-slate-950" : answers[item.id] ? "border-brand-teal/40 bg-brand-teal/10 dark:border-brand-aqua/40 dark:bg-brand-aqua/10" : "border-current/15"}`}
            >
              {number + 1}
            </button>
          ))}
        </div>
      </nav>
      <dialog
        ref={dialogRef}
        onClose={() => setShowConfirm(false)}
        aria-labelledby="submit-title"
        className="w-[calc(100%-2rem)] max-w-md rounded-2xl border border-current/10 bg-[var(--surface)] p-6 text-[var(--foreground)] shadow-xl backdrop:bg-black/50"
      >
        <h2 id="submit-title" className="mb-3 text-xl font-semibold">
          Ready to finish?
        </h2>
        <p className="text-sm leading-relaxed text-text-muted dark:text-text-dark-muted">
          You’ve answered {count} of {questions.length} questions.{" "}
          {count < questions.length
            ? `${questions.length - count} will be marked unanswered.`
            : "Your answers are ready to be checked."}{" "}
          You can review explanations after submitting.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button autoFocus className="btn-secondary flex-1" onClick={() => setShowConfirm(false)}>
            Keep practising
          </button>
          <button
            className="btn-primary flex-1"
            disabled={submitting}
            onClick={() => void submit()}
          >
            Submit answers
          </button>
        </div>
      </dialog>
    </div>
  );
}
export default function MockExamPage() {
  return (
    <Suspense fallback={<ExamLoading />}>
      <MockExamContent />
    </Suspense>
  );
}
