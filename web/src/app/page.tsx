import dynamic from "next/dynamic";
import Link from "next/link";
import { Search, Bell, Play, ChevronDown } from "lucide-react";

const Sidebar = dynamic(() => import("@/components/dashboard/Sidebar"), { ssr: false });
const LockedSection = dynamic(() => import("@/components/dashboard/LockedSection"), { ssr: false });
const ThemeToggle = dynamic(() => import("@/components/theme/ThemeToggle"), { ssr: false });
const ThemeProvider = dynamic(() => import("@/components/theme/ThemeContext").then(m => ({ default: m.ThemeProvider })), { ssr: false });

const courses = [
  { name: "Mathematics", hours: 38, progress: 72, status: "In progress", color: "from-brand-teal to-brand-aqua" },
  { name: "English Language", hours: 24, progress: 55, status: "In progress", color: "from-brand-purple to-brand-violet" },
  { name: "Physics", hours: 42, progress: 85, status: "In progress", color: "from-brand-ocean to-brand-surf" },
  { name: "Chemistry", hours: 19, progress: 30, status: "In progress", color: "from-brand-french to-brand-teal" },
];

const progressBars = [
  { day: "Mon", height: "60%" },
  { day: "Tue", height: "80%" },
  { day: "Wed", height: "45%" },
  { day: "Thu", height: "90%" },
  { day: "Fri", height: "70%" },
  { day: "Sat", height: "35%" },
  { day: "Sun", height: "55%" },
];

export default function LandingPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex bg-background-light dark:bg-background-dark transition-colors duration-500">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Top bar */}
          <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-brand-teal/10 dark:border-brand-frost/[0.06] bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl">
            <h1 className="font-heading font-bold text-xl text-text-primary dark:text-text-dark-primary">
              My Classes
            </h1>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-btn border border-brand-teal/15 dark:border-brand-frost/10 bg-surface-light dark:bg-surface-dark">
                <Search className="w-4 h-4 text-text-muted dark:text-text-dark-muted" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-sm outline-none w-32 text-text-primary dark:text-text-dark-primary placeholder:text-text-muted/50"
                />
              </div>
              <Bell className="w-5 h-5 text-text-muted dark:text-text-dark-muted cursor-pointer hover:text-brand-surf transition-colors" />
              <ThemeToggle />
              {/* Avatar placeholder */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-teal to-brand-purple" />
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* ═══ HERO BANNER — Cinematic copy ═══ */}
            <section className="dash-card relative overflow-hidden min-h-[220px] flex flex-col justify-end">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-hero rounded-section" />
              {/* Animated orbs */}
              <div className="absolute top-6 right-10 w-32 h-32 bg-brand-surf/10 rounded-full blur-[60px] animate-float" />
              <div className="absolute bottom-4 right-1/4 w-24 h-24 bg-brand-purple/15 rounded-full blur-[50px] animate-float" style={{ animationDelay: "2s" }} />

              <div className="relative z-10 p-6">
                <span className="inline-block px-3 py-1 rounded-pill text-xs font-bold bg-brand-surf/20 text-brand-aqua border border-brand-surf/30 mb-4">
                  JAMB (UTME)
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-black text-white leading-tight max-w-md">
                  Clarity is the new advantage.
                </h2>
                <p className="text-brand-frost/60 mt-2 text-sm max-w-sm">
                  Master JAMB and WAEC with cinematic precision. One mock at a time.
                </p>
                <div className="flex items-center gap-4 mt-5">
                  <Link href="/login" className="btn-primary text-sm px-6 py-2.5">
                    Start Learning
                  </Link>
                  <button className="flex items-center gap-2 text-brand-frost/70 text-sm hover:text-brand-aqua transition-colors">
                    <Play className="w-4 h-4" fill="currentColor" />
                    Watch demo
                  </button>
                </div>
              </div>
            </section>

            {/* ═══ TWO-COLUMN LAYOUT: Courses + Progress ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Courses you're taking — LEFT (3/5) */}
              <div className="lg:col-span-3">
                <LockedSection title="Your Courses">
                  <div className="dash-card">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-heading font-bold text-base text-text-primary dark:text-text-dark-primary">
                        Courses you&apos;re taking
                      </h3>
                      <button className="flex items-center gap-1 text-xs text-text-muted dark:text-text-dark-muted hover:text-brand-surf transition-colors">
                        Filter by <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {courses.map((course) => (
                        <div
                          key={course.name}
                          className="flex items-center gap-4 p-3 rounded-card border border-brand-teal/[0.06] dark:border-brand-frost/[0.04] hover:border-brand-surf/20 transition-all duration-300"
                        >
                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-btn bg-gradient-to-br ${course.color} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white font-bold text-xs">{course.name.charAt(0)}</span>
                          </div>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-body font-medium text-sm text-text-primary dark:text-text-dark-primary truncate">
                              {course.name}
                            </p>
                            <p className="text-xs text-text-muted dark:text-text-dark-muted mt-0.5">
                              {course.hours} hours spent &middot; {course.progress}%
                            </p>
                            {/* Progress bar */}
                            <div className="progress-bar mt-2">
                              <div className="progress-bar-fill" style={{ width: `${course.progress}%` }} />
                            </div>
                          </div>
                          {/* Status */}
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-pill bg-brand-surf/10 text-brand-surf border border-brand-surf/20 whitespace-nowrap">
                            {course.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </LockedSection>
              </div>

              {/* My Progress — RIGHT (2/5) */}
              <div className="lg:col-span-2 space-y-5">
                {/* Study time chart */}
                <LockedSection title="Study Analytics">
                  <div className="dash-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading font-bold text-sm text-text-primary dark:text-text-dark-primary">
                        Track your study time
                      </h3>
                    </div>
                    {/* Bar chart */}
                    <div className="flex items-end gap-2 h-28">
                      {progressBars.map((bar) => (
                        <div key={bar.day} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full rounded-t bg-gradient-to-t from-brand-teal to-brand-surf transition-all duration-700" style={{ height: bar.height }} />
                          <span className="text-[9px] text-text-muted dark:text-text-dark-muted">{bar.day}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-3xl font-heading font-black text-text-primary dark:text-text-dark-primary">124</span>
                      <span className="text-xs text-text-muted dark:text-text-dark-muted ml-1">Hours</span>
                    </div>
                  </div>
                </LockedSection>

                {/* Courses completed */}
                <LockedSection title="Achievements">
                  <div className="dash-card flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-muted dark:text-text-dark-muted">Courses completed</p>
                      <p className="text-4xl font-heading font-black text-text-primary dark:text-text-dark-primary mt-1">36</p>
                      <p className="text-[10px] text-brand-surf mt-1">76% completion rate</p>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-brand-surf/30 flex items-center justify-center">
                      <span className="text-sm font-bold text-brand-surf">76%</span>
                    </div>
                  </div>
                </LockedSection>

                {/* Performance graph */}
                <LockedSection title="Performance">
                  <div className="dash-card">
                    <h3 className="font-heading font-bold text-sm text-text-primary dark:text-text-dark-primary mb-3">
                      Performance
                    </h3>
                    {/* Fake SVG wave line */}
                    <svg viewBox="0 0 200 50" className="w-full h-12 overflow-visible">
                      <path
                        d="M0,40 C20,35 40,10 60,20 C80,30 100,5 120,15 C140,25 160,8 180,12 L200,10"
                        fill="none"
                        stroke="url(#perfGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="perfGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#6C3AE0" />
                          <stop offset="50%" stopColor="#00b4d8" />
                          <stop offset="100%" stopColor="#48cae4" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </LockedSection>
              </div>
            </div>

            {/* ═══ CTA SECTION ═══ */}
            <section className="dash-card text-center py-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-brand opacity-[0.03] rounded-section" />
              <h2 className="font-heading font-black text-2xl text-text-primary dark:text-text-dark-primary relative z-10">
                Ready to ace your exams?
              </h2>
              <p className="text-text-muted dark:text-text-dark-muted text-sm mt-2 relative z-10">
                Join thousands of students preparing smarter with CrysLearn.
              </p>
              <Link href="/login" className="btn-primary mt-5 relative z-10">
                Get Started Free
              </Link>
            </section>

            {/* Footer */}
            <footer className="text-center py-6">
              <span className="font-heading font-bold text-lg bg-gradient-to-r from-brand-teal via-brand-purple to-brand-surf bg-clip-text text-transparent">
                CrysLearn
              </span>
              <p className="text-xs text-text-muted dark:text-text-dark-muted mt-1">
                &copy; 2026 CrysLearn. Where exam success becomes crystal clear.
              </p>
            </footer>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
