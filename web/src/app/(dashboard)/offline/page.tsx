import Link from "next/link";
import { ArrowRight, BookOpen, WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="max-w-4xl space-y-8">
      <header>
        <p className="page-kicker">Study access</p>
        <h1 className="page-title">Stay connected to your preparation.</h1>
        <p className="page-intro mt-3">
          CrysLearn currently needs an internet connection to load questions and save your mock
          results.
        </p>
      </header>
      <section className="dash-card flex flex-col items-start gap-5 sm:flex-row sm:gap-7">
        <WifiOff
          size={32}
          strokeWidth={1.5}
          className="shrink-0 text-brand-teal dark:text-brand-surf"
        />
        <div>
          <h2 className="font-heading text-2xl font-bold text-text-primary dark:text-text-dark-primary">
            Question downloads aren&apos;t available yet.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-muted dark:text-text-dark-muted">
            There are no downloadable question packs in the web app. Unlocking an exam gives you
            access to its online practice; it does not enable offline downloads.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-muted dark:text-text-dark-muted">
            Use a stable connection for timed mocks, and keep the exam tab open until your result
            has been saved.
          </p>
          <Link href="/exams" className="btn-primary mt-6 gap-2">
            Browse exams
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <section className="flex items-start gap-4 border-t border-brand-teal/15 pt-6 dark:border-brand-frost/15">
        <BookOpen size={22} className="mt-1 shrink-0 text-brand-teal dark:text-brand-surf" />
        <div>
          <h2 className="font-heading text-xl font-bold text-text-primary dark:text-text-dark-primary">
            Make the most of your next session.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted dark:text-text-dark-muted">
            Choose your topics ahead of time. Your weekly planner is saved on this browser when you
            press Save plan.
          </p>
          <Link
            href="/schedule"
            className="mt-4 inline-flex min-h-touch items-center gap-2 text-sm font-semibold text-brand-teal dark:text-brand-surf"
          >
            Plan your week
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
