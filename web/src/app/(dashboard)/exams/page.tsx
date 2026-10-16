import Link from "next/link";
import { EXAMS, EXAM_SLUGS } from "@shared/constants/exams";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

export default function ExamsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-9 max-w-2xl">
        <p className="page-kicker">Your next chapter</p>
        <h1 className="page-title">Build confidence, one exam at a time.</h1>
        <p className="page-intro">
          Study at your pace with past questions, or put your preparation to the test with a timed
          mock.
        </p>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        {EXAM_SLUGS.map((slug, index) => {
          const exam = EXAMS[slug];
          return (
            <article key={slug} className="dash-card flex flex-col !p-6 sm:!p-8">
              <div className="mb-8 flex items-start justify-between">
                <span className="font-mono text-xs text-text-muted dark:text-text-dark-muted">
                  EXAM / 0{index + 1}
                </span>
                <BookOpen
                  aria-hidden="true"
                  className="h-5 w-5 text-brand-teal dark:text-brand-aqua"
                />
              </div>
              <h2 className="mb-2 font-heading text-3xl font-bold">{exam.name}</h2>
              <p className="mb-7 min-h-12 text-sm leading-relaxed text-text-muted dark:text-text-dark-muted">
                {exam.fullName}
              </p>
              <dl className="mb-8 grid grid-cols-2 gap-5 border-y border-current/10 py-5">
                <div>
                  <dt className="text-xs text-text-muted dark:text-text-dark-muted">
                    Mock duration
                  </dt>
                  <dd className="mt-1 flex items-center gap-1.5 font-semibold">
                    <Clock aria-hidden="true" className="h-4 w-4" />
                    {exam.mockDurationMinutes} minutes
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-text-muted dark:text-text-dark-muted">
                    Question limit
                  </dt>
                  <dd className="mt-1 font-semibold">Up to {exam.mockQuestionCount}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-text-muted dark:text-text-dark-muted">Choose from</dt>
                  <dd className="mt-1 text-sm">{exam.subjects.length} subjects</dd>
                </div>
              </dl>
              <div className="mt-auto flex flex-wrap gap-3">
                <Link
                  href={`/exams/${slug}/subjects`}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  Set up a mock <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Link href={`/exams/${slug}/history`} className="btn-secondary">
                  Browse past questions
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-text-muted dark:text-text-dark-muted">
        Your mock uses the questions available for your selected subjects. Review every answer when
        you finish.
      </p>
    </div>
  );
}
