"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { EXAMS, EXAM_SLUGS } from "@shared/constants/exams";
import { useAuth } from "@/hooks/useAuth";
import { getExam, type PracticeQuestion } from "@/lib/exam";
import { examRequest } from "@/lib/exam-client";
import type { ExamSlug } from "@/types/database";
import { ExamLoading, ExamMessage } from "./ExamState";

interface QuestionPage {
  questions: PracticeQuestion[];
  count: number;
  years: number[];
  page: number;
  pageSize: number;
  unavailable: number;
}

function QuestionItem({
  question,
  number,
  slug,
}: {
  question: PracticeQuestion;
  number: number;
  slug: ExamSlug;
}) {
  const [open, setOpen] = useState(false);
  const [reveal, setReveal] = useState(false);
  const answer = useQuery({
    queryKey: ["practice-answer", slug, question.id],
    queryFn: ({ signal }) =>
      examRequest<{ question: PracticeQuestion }>(
        `/api/exams/${slug}/questions?answer=${question.id}`,
        { signal },
      ),
    enabled: reveal,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  return (
    <article className="dash-card !p-0 overflow-hidden">
      <h2>
        <button
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={`question-${question.id}`}
          className="flex min-h-24 w-full items-start gap-4 p-5 text-left sm:p-6"
        >
          <span className="mt-0.5 font-mono text-xs text-text-muted dark:text-text-dark-muted">
            {String(number).padStart(2, "0")}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block whitespace-pre-line text-sm font-medium leading-relaxed">
              {question.question_text}
            </span>
            <span className="mt-3 block text-xs text-text-muted dark:text-text-dark-muted">
              {question.subject} · {question.year}
            </span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`mt-1 h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </h2>
      {open && (
        <div id={`question-${question.id}`} className="border-t border-current/10 p-5 sm:p-6">
          <ul className="space-y-2">
            {question.options.map((option) => {
              const correct = reveal && answer.data?.question.correct_option === option.label;
              return (
                <li
                  key={option.label}
                  className={`rounded-lg px-4 py-3 text-sm leading-relaxed ${correct ? "bg-brand-teal/10 font-medium text-brand-teal dark:text-brand-aqua" : "bg-current/[0.025]"}`}
                >
                  <span className="mr-3 font-mono">{option.label}.</span>
                  {option.text}
                  {correct && <span className="ml-2 text-xs">✓ Correct answer</span>}
                </li>
              );
            })}
          </ul>
          <button
            onClick={() => setReveal((value) => !value)}
            aria-expanded={reveal}
            className="mt-3 min-h-11 text-sm font-semibold text-brand-teal hover:underline dark:text-brand-aqua"
          >
            {reveal ? "Hide answer" : "Show answer & explanation"}
          </button>
          {reveal && (
            <div
              role="status"
              className="mt-2 rounded-xl border border-brand-teal/20 bg-brand-teal/5 p-4 text-sm leading-relaxed dark:border-brand-aqua/20 dark:bg-brand-aqua/5"
            >
              {answer.isLoading ? (
                "Opening the explanation…"
              ) : answer.isError ? (
                <>
                  <p>We couldn’t load this answer.</p>
                  <button
                    className="mt-2 min-h-11 font-semibold underline"
                    onClick={() => void answer.refetch()}
                  >
                    Try again
                  </button>
                </>
              ) : (
                <>
                  <p className="mb-2 font-semibold">
                    Answer: {answer.data?.question.correct_option}
                  </p>
                  <p>
                    {answer.data?.question.explanation ||
                      "An explanation hasn’t been added for this question yet."}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function QuestionBrowser({ fixedExam }: { fixedExam?: string }) {
  const [selectedExam, setSelectedExam] = useState<ExamSlug>(EXAM_SLUGS[0]);
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);
  const { user, loading: authLoading } = useAuth();
  const exam = getExam(fixedExam ?? selectedExam);
  const query = new URLSearchParams({
    page: String(page),
    ...(subject ? { subject } : {}),
    ...(year ? { year } : {}),
  });
  const questions = useQuery({
    queryKey: ["practice-questions", user?.id, exam?.slug, subject, year, page],
    queryFn: ({ signal }) =>
      examRequest<QuestionPage>(`/api/exams/${exam!.slug}/questions?${query}`, { signal }),
    enabled: !!user && !!exam,
    retry: 1,
  });
  if (!exam)
    return (
      <ExamMessage title="Exam not found">
        Choose an available exam to browse its question bank.
      </ExamMessage>
    );
  if (authLoading) return <ExamLoading />;
  if (!user)
    return (
      <ExamMessage title="Good preparation starts here" signIn>
        Sign in to explore past questions and learn from the explanations.
      </ExamMessage>
    );
  const data = questions.data;
  const pages = data ? Math.ceil(data.count / data.pageSize) : 0;
  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="page-kicker">The question library</p>
          <h1 className="page-title">
            {fixedExam
              ? `${exam.name} past questions`
              : "Understand the question. Learn the answer."}
          </h1>
          <p className="page-intro">
            Take your time. Explore a subject, try the options, then open the explanation when
            you’re ready.
          </p>
        </div>
        <Link className="btn-secondary text-sm" href={`/exams/${exam.slug}/subjects`}>
          Try a timed mock
        </Link>
      </header>
      <section aria-label="Question filters" className="dash-card mb-7">
        <div className="grid gap-4 sm:grid-cols-3">
          {!fixedExam && (
            <label className="text-xs font-semibold">
              Exam
              <select
                value={selectedExam}
                onChange={(event) => {
                  setSelectedExam(event.target.value as ExamSlug);
                  setSubject("");
                  setYear("");
                  setPage(1);
                }}
                className="input-field mt-2 w-full"
              >
                {EXAM_SLUGS.map((slug) => (
                  <option key={slug} value={slug}>
                    {EXAMS[slug].name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="text-xs font-semibold">
            Subject
            <select
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value);
                setPage(1);
              }}
              className="input-field mt-2 w-full"
            >
              <option value="">All subjects</option>
              {exam.subjects.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold">
            Year
            <select
              value={year}
              onChange={(event) => {
                setYear(event.target.value);
                setPage(1);
              }}
              className="input-field mt-2 w-full"
            >
              <option value="">All years</option>
              {(data?.years ?? (year ? [Number(year)] : [])).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        {(subject || year) && (
          <button
            onClick={() => {
              setSubject("");
              setYear("");
              setPage(1);
            }}
            className="mt-3 min-h-11 text-sm text-brand-teal hover:underline dark:text-brand-aqua"
          >
            Clear filters
          </button>
        )}
      </section>
      {questions.isLoading ? (
        <ExamLoading message="Finding your questions…" />
      ) : questions.isError ? (
        <ExamMessage title="The library couldn’t load" retry={() => void questions.refetch()}>
          {questions.error instanceof Error
            ? questions.error.message
            : "Please try again in a moment."}
        </ExamMessage>
      ) : data && data.questions.length ? (
        <>
          <div
            aria-live="polite"
            className="mb-4 flex items-center gap-2 text-xs text-text-muted dark:text-text-dark-muted"
          >
            <BookOpen aria-hidden="true" className="h-4 w-4" />
            {data.count} {data.count === 1 ? "question" : "questions"} · Page {page} of {pages}
          </div>
          <div className="space-y-3">
            {data.questions.map((question, index) => (
              <QuestionItem
                key={`${exam.slug}:${question.id}`}
                question={question}
                slug={exam.slug}
                number={(page - 1) * data.pageSize + index + 1}
              />
            ))}
          </div>
          {data.unavailable > 0 && (
            <p className="mt-4 text-sm text-text-muted dark:text-text-dark-muted">
              {data.unavailable} {data.unavailable === 1 ? "question needs" : "questions need"} a
              content update and could not be displayed.
            </p>
          )}
          <nav aria-label="Question pages" className="mt-6 flex items-center justify-between gap-3">
            <button
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
              className="btn-secondary flex items-center gap-1 disabled:opacity-40"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              Previous
            </button>
            <span className="text-xs text-text-muted dark:text-text-dark-muted">
              {page} / {pages}
            </span>
            <button
              disabled={page >= pages}
              onClick={() => setPage((value) => value + 1)}
              className="btn-secondary flex items-center gap-1 disabled:opacity-40"
            >
              Next
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </nav>
        </>
      ) : (
        <div className="dash-card py-12 text-center">
          <BookOpen
            aria-hidden="true"
            className="mx-auto mb-4 h-7 w-7 text-brand-teal dark:text-brand-aqua"
          />
          <h2 className="text-lg font-semibold">
            {data?.count
              ? "These questions need a content update"
              : "No questions in this selection yet"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-muted dark:text-text-dark-muted">
            {data?.count
              ? "The stored options could not be read safely. Try another page or subject."
              : "Try another subject or clear the filters to explore what’s available."}
          </p>
          {pages > page && (
            <button className="btn-secondary mt-4" onClick={() => setPage((value) => value + 1)}>
              Try the next page
            </button>
          )}
        </div>
      )}
    </div>
  );
}
