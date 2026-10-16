import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, MessageCircle, NotebookPen } from "lucide-react";

export default function CrystalAIChatPage() {
  return (
    <main className="min-h-screen bg-background-light px-5 py-7 text-text-primary dark:bg-background-dark dark:text-text-dark-primary sm:px-10 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <nav
          aria-label="Tutor navigation"
          className="mb-14 flex flex-wrap items-center justify-between gap-4 border-b border-brand-teal/15 pb-5 dark:border-brand-frost/15"
        >
          <Link href="/dashboard" className="font-heading text-xl font-bold">
            CrysLearn<span className="text-brand-teal dark:text-brand-surf">.</span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex min-h-touch items-center gap-2 text-sm text-text-muted dark:text-text-dark-muted"
          >
            <ArrowLeft size={16} />
            Back to your study desk
          </Link>
        </nav>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
          <section>
            <p className="page-kicker">Crystal AI</p>
            <h1 className="page-title mt-3">Good questions deserve clear answers.</h1>
            <p className="page-intro mt-5">
              An AI tutor is planned for CrysLearn. It isn&apos;t available in this version, and
              there is no chat service to connect to yet.
            </p>
            <div className="mt-7 inline-flex items-center gap-2 rounded-pill border border-brand-teal/20 px-4 py-2 text-xs font-semibold text-brand-teal dark:border-brand-surf/25 dark:text-brand-surf">
              <MessageCircle size={15} />
              Not available yet
            </div>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-text-muted dark:text-text-dark-muted">
              You don&apos;t need to make a payment to activate this page. For now, use past
              questions to practise and review the answer explanations supplied with each question.
            </p>
            <Link href="/past-questions" className="btn-primary mt-7 gap-2">
              Practise past questions
              <ArrowRight size={17} />
            </Link>
          </section>
          <aside className="dash-card space-y-7">
            <div>
              <BookOpen
                size={26}
                strokeWidth={1.5}
                className="mb-5 text-brand-teal dark:text-brand-surf"
              />
              <h2 className="font-heading text-2xl font-bold">Make the explanation stick.</h2>
              <ol className="mt-5 space-y-4 text-sm leading-relaxed text-text-muted dark:text-text-dark-muted">
                <li>
                  <span className="mr-3 font-mono text-xs text-brand-teal dark:text-brand-surf">
                    01
                  </span>
                  Try the question before revealing the answer.
                </li>
                <li>
                  <span className="mr-3 font-mono text-xs text-brand-teal dark:text-brand-surf">
                    02
                  </span>
                  Read the explanation and find the step you missed.
                </li>
                <li>
                  <span className="mr-3 font-mono text-xs text-brand-teal dark:text-brand-surf">
                    03
                  </span>
                  Add that topic to your next study session.
                </li>
              </ol>
            </div>
            <Link
              href="/schedule"
              className="flex min-h-touch items-center justify-between gap-3 border-t border-brand-teal/15 pt-5 text-sm font-semibold text-brand-teal dark:border-brand-frost/15 dark:text-brand-surf"
            >
              <span className="inline-flex items-center gap-2">
                <NotebookPen size={17} />
                Make a study plan
              </span>
              <ArrowRight size={16} />
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
