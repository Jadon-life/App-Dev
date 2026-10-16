import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Clock3,
  ChartNoAxesCombined,
  Check,
  Minus,
} from "lucide-react";
import { EXAMS, EXAM_SLUGS } from "@shared/constants/exams";
import ThemeToggle from "@/components/theme/ThemeToggle";
import BookPreview from "@/components/marketing/BookPreview";

const steps = [
  {
    number: "01",
    title: "Choose your focus",
    description: "Pick your exam and the subjects you want to work on.",
  },
  {
    number: "02",
    title: "Put it into practice",
    description: "Work through past questions or take a timed mock.",
  },
  {
    number: "03",
    title: "Learn from the result",
    description: "Review your answers, understand the gaps, and plan what’s next.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-background-light text-text-primary dark:bg-background-dark dark:text-text-dark-primary">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="border-b border-brand-teal/15 dark:border-brand-frost/15">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8"
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 font-heading text-xl font-semibold tracking-tight"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-teal text-white dark:bg-brand-frost dark:text-background-dark">
              C.
            </span>
            CrysLearn
          </Link>
          <div className="flex items-center gap-2 sm:gap-6">
            <a
              href="#how-it-works"
              className="hidden min-h-touch items-center text-sm muted sm:inline-flex"
            >
              How it works
            </a>
            <a
              href="#exams"
              className="hidden min-h-touch items-center text-sm muted md:inline-flex"
            >
              Exam access
            </a>
            <ThemeToggle />
            <Link href="/login" className="btn-primary !px-4">
              Log in <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </header>
      <main id="main-content">
        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-20 lg:py-24">
          <div>
            <p className="page-kicker">Made for your next chapter · UTME & WAEC</p>
            <h1 className="display-title mt-6 text-5xl sm:text-6xl lg:text-7xl">
              A little practice.
              <br />
              <span className="text-brand-teal dark:text-brand-frost">A clearer path.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-8 muted sm:text-lg">
              Exam preparation can feel like a lot. Find your focus with past questions, timed
              practice, and a clear view of your progress.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/login" className="btn-primary">
                Find your starting point <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a href="#how-it-works" className="btn-secondary">
                Take a look around
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs muted">
              <span className="inline-flex items-center gap-2">
                <Check
                  className="h-4 w-4 text-brand-teal dark:text-brand-frost"
                  aria-hidden="true"
                />
                Subject-by-subject practice
              </span>
              <span className="inline-flex items-center gap-2">
                <Check
                  className="h-4 w-4 text-brand-teal dark:text-brand-frost"
                  aria-hidden="true"
                />
                Your pace, your plan
              </span>
            </div>
          </div>
          <div className="relative lg:pl-4">
            <div className="relative overflow-hidden rounded-[18px] border border-brand-teal/20 bg-[#e6eee5] p-6 text-[#183d3b] sm:p-9 dark:border-brand-frost/20 dark:bg-[#203b34] dark:text-[#edf3ed]">
              <div className="flex items-start justify-between border-b border-current/20 pb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.2em]">
                    The CrysLearn method
                  </p>
                  <h2 className="mt-3 font-serif text-3xl">
                    Less guesswork.
                    <br />
                    More understanding.
                  </h2>
                </div>
                <BookOpen
                  className="mt-1 h-7 w-7 shrink-0 opacity-60"
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
              </div>
              <ol className="divide-y divide-current/15">
                {steps.map((step) => (
                  <li key={step.number} className="flex gap-5 py-6">
                    <span className="pt-1 font-mono text-xs opacity-60">{step.number}</span>
                    <div>
                      <h3 className="text-sm font-semibold">{step.title}</h3>
                      <p className="mt-2 max-w-xs text-sm leading-6 opacity-80">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="border-t border-current/20 pt-5">
                <BookPreview />
              </div>
            </div>
            <p className="mt-4 text-center font-serif text-sm italic muted">
              Small steps count. Especially the ones you repeat.
            </p>
          </div>
        </section>
        <section
          id="how-it-works"
          className="scroll-mt-8 border-y border-brand-teal/15 dark:border-brand-frost/15"
        >
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <p className="page-kicker">A study space, with a purpose</p>
                <h2 className="display-title max-w-md text-4xl sm:text-5xl">
                  Know what to work on.
                  <br />
                  Then get to work.
                </h2>
              </div>
              <p className="max-w-lg self-end text-base leading-8 muted">
                Start with a question, build a habit, and use each result to guide the next session.
                Everything has a place, so you can concentrate on learning.
              </p>
            </div>
            <div className="mt-12 grid gap-9 md:grid-cols-3">
              {[
                {
                  icon: BookOpen,
                  title: "A question library",
                  copy: "Browse the available questions by exam and subject. Check the explanation when you need another way to understand an answer.",
                },
                {
                  icon: Clock3,
                  title: "Practice with a clock",
                  copy: "Build confidence under exam conditions. Move between questions, review your choices, and submit when you’re ready.",
                },
                {
                  icon: ChartNoAxesCombined,
                  title: "Progress you can use",
                  copy: "Keep your completed attempts in one place. Turn what you learn into a realistic weekly study plan.",
                },
              ].map((feature, i) => (
                <article
                  key={feature.title}
                  className="border-t border-brand-teal/25 pt-6 dark:border-brand-frost/25"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <feature.icon
                      className="h-6 w-6 text-brand-teal dark:text-brand-frost"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span className="font-mono text-xs muted">0{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 muted">{feature.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="exams" className="mx-auto max-w-7xl scroll-mt-8 px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="page-kicker">Your exam. Your focus.</p>
              <h2 className="display-title text-4xl sm:text-5xl">Make the next session count.</h2>
            </div>
            <Link
              href="/exams"
              className="inline-flex min-h-touch items-center gap-2 text-sm font-semibold text-brand-teal dark:text-brand-frost"
            >
              Explore exams <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {EXAM_SLUGS.map((slug) => {
              const exam = EXAMS[slug];
              return (
                <article key={slug} className="dash-card !p-7 sm:!p-8">
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded border border-brand-teal/20 px-2 py-1 font-mono text-xs dark:border-brand-frost/20">
                      {exam.name}
                    </span>
                    <Minus className="h-5 w-5 muted" aria-hidden="true" />
                  </div>
                  <h3 className="mt-7 text-2xl font-semibold">
                    {slug === "jamb"
                      ? "Your university journey starts here."
                      : "Build a strong finish to secondary school."}
                  </h3>
                  <p className="mt-4 text-sm leading-7 muted">
                    {exam.subjects.length} subjects · up to {exam.mockQuestionCount} questions per
                    mock · {exam.mockDurationMinutes}-minute sessions
                  </p>
                  <p className="mt-3 text-xs leading-6 muted">
                    Question availability depends on the subjects in the library.
                  </p>
                  <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-brand-teal/15 pt-6 dark:border-brand-frost/15">
                    <div>
                      <p className="text-sm font-medium">Exam access: {exam.priceFormatted}</p>
                      <p className="mt-1 text-xs muted">One-time payment where required</p>
                    </div>
                    <Link href={`/exams/${slug}/subjects`} className="btn-secondary">
                      Explore {exam.name} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
        <section className="mx-5 mb-12 rounded-section bg-[#183d3b] px-6 py-14 text-[#edf3ed] sm:mx-8 sm:px-12 lg:mx-auto lg:max-w-[calc(80rem-4rem)]">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[.18em] text-[#b7d9c9]">
                A fresh page is waiting
              </p>
              <h2 className="display-title max-w-xl text-4xl sm:text-5xl">
                You don’t need to know it all.
                <br />
                Just where to begin.
              </h2>
            </div>
            <Link
              href="/login"
              className="inline-flex min-h-touch shrink-0 items-center justify-center gap-3 rounded-btn bg-[#edf3ed] px-6 py-4 text-sm font-semibold text-[#183d3b]"
            >
              Start your next chapter <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-8 text-xs muted sm:flex-row sm:items-center sm:px-8">
        <p>© {new Date().getFullYear()} CrysLearn. Learn with clarity.</p>
        <nav aria-label="Footer navigation" className="flex gap-6">
          <Link className="inline-flex min-h-touch items-center" href="/home">
            About CrysLearn
          </Link>
          <Link className="inline-flex min-h-touch items-center" href="/login">
            Your account
          </Link>
        </nav>
      </footer>
    </div>
  );
}
