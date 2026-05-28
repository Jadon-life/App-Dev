"use client";

/**
 * Home Page — The main website that appears after the book opens.
 * Contains: hero headline, features, pricing (UTME + WAEC), CTA, footer.
 * This is the SaaS landing page — NOT the dashboard.
 */

import Link from "next/link";
import { BookOpen, Clock, Brain, BarChart3, Wifi, Shield, ArrowRight, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";

const ThemeToggle = dynamic(() => import("@/components/theme/ThemeToggle"), { ssr: false });
const ThemeProvider = dynamic(() => import("@/components/theme/ThemeContext").then(m => ({ default: m.ThemeProvider })), { ssr: false });

const features = [
  { icon: BookOpen, title: "10+ Years Past Questions", description: "Complete question banks for UTME and WAEC, filtered by subject and year." },
  { icon: Clock, title: "Timed Mock Exams", description: "Full exam simulations with automatic scoring and performance breakdown." },
  { icon: Brain, title: "AI-Powered Explanations", description: "Every question has a crystal-clear, step-by-step solution." },
  { icon: BarChart3, title: "Performance Tracking", description: "Track improvement over time, subject by subject. See your weak areas." },
  { icon: Wifi, title: "Offline Mode", description: "Download question packs and study without internet access." },
  { icon: Shield, title: "Parent Dashboard", description: "Parents can monitor mock scores, study time, and progress." },
];

const exams = [
  { name: "UTME", price: "3,500", subjects: "12 subjects", questions: "60 questions per mock" },
  { name: "WAEC (SSCE)", price: "3,500", subjects: "12 subjects", questions: "50 questions per mock" },
];

export default function HomePage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-500">
        {/* ═══ NAVIGATION ═══ */}
        <nav className="sticky top-0 z-50 border-b border-brand-teal/10 dark:border-brand-frost/[0.06] bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="font-heading font-black text-xl bg-gradient-to-r from-brand-aqua via-brand-surf to-brand-purple bg-clip-text text-transparent">
                CrysLearn
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/dashboard" className="text-sm text-text-muted dark:text-text-dark-muted hover:text-brand-surf transition-colors hidden sm:block">
                Dashboard
              </Link>
              <Link href="/login" className="text-sm text-text-muted dark:text-text-dark-muted hover:text-brand-surf transition-colors hidden sm:block">
                Log in
              </Link>
              <Link href="/login" className="btn-primary text-sm">
                Start Learning
              </Link>
            </div>
          </div>
        </nav>

        {/* ═══ HERO ═══ */}
        <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
          {/* Background effects */}
          <div className="absolute top-20 left-[10%] w-80 h-80 bg-brand-surf/[0.04] rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-[10%] w-60 h-60 bg-brand-purple/[0.06] rounded-full blur-[100px]" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-brand-surf/10 border border-brand-surf/20 mb-8">
              <Sparkles className="w-4 h-4 text-brand-aqua" />
              <span className="text-xs font-bold text-brand-surf">AI-Powered Exam Preparation</span>
            </div>

            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-7xl text-text-primary dark:text-text-dark-primary leading-[1.05] tracking-tight">
              Clarity is the
              <br />
              <span className="bg-gradient-to-r from-brand-teal via-brand-surf to-brand-purple bg-clip-text text-transparent">
                new advantage.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-text-muted dark:text-text-dark-muted max-w-xl mx-auto leading-relaxed">
              Master UTME and WAEC with cinematic precision. Timed mocks, AI explanations, and progress tracking — all in one place.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="btn-primary text-base px-8 py-3.5 gap-2">
                Start Preparing <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/dashboard" className="btn-secondary text-base px-8 py-3.5">
                View Dashboard
              </Link>
            </div>

            <p className="mt-8 text-xs text-text-muted/50 dark:text-text-dark-muted/50">
              Trusted by students across Nigeria. Pay once, prep forever.
            </p>
          </div>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section className="py-20 sm:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text-primary dark:text-text-dark-primary">
                Everything you need to score high
              </h2>
              <p className="text-text-muted dark:text-text-dark-muted mt-2 text-sm">
                Powerful tools designed for Nigerian students
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group dash-card hover:border-brand-surf/20 dark:hover:border-brand-surf/10 hover:shadow-glow transition-all duration-500"
                >
                  <div className="w-11 h-11 rounded-btn bg-gradient-to-br from-brand-teal/10 to-brand-purple/10 dark:from-brand-teal/20 dark:to-brand-purple/20 flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow duration-500">
                    <feature.icon className="w-5 h-5 text-brand-surf" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-text-primary dark:text-text-dark-primary">
                    {feature.title}
                  </h3>
                  <p className="text-text-muted dark:text-text-dark-muted text-sm mt-2 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PRICING ═══ */}
        <section className="py-20 sm:py-28 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-teal/[0.02] to-transparent dark:via-brand-surf/[0.02]" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-14">
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text-primary dark:text-text-dark-primary">
                Simple, one-time pricing
              </h2>
              <p className="text-text-muted dark:text-text-dark-muted mt-2 text-sm">
                No subscriptions. Pay once and get lifetime access.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {exams.map((exam) => (
                <div
                  key={exam.name}
                  className="dash-card text-center border-2 border-brand-teal/10 dark:border-brand-surf/[0.08] hover:border-brand-surf/30 dark:hover:border-brand-surf/20 hover:shadow-glow transition-all duration-500"
                >
                  <h3 className="font-heading font-bold text-xl text-text-primary dark:text-text-dark-primary">
                    {exam.name}
                  </h3>
                  <p className="text-xs text-text-muted dark:text-text-dark-muted mt-1">
                    {exam.subjects} &middot; {exam.questions}
                  </p>
                  <p className="text-4xl font-heading font-black mt-4 bg-gradient-to-r from-brand-teal to-brand-surf bg-clip-text text-transparent">
                    &#8358;{exam.price}
                  </p>
                  <p className="text-xs text-text-muted/60 dark:text-text-dark-muted/60 mt-1">
                    one-time payment
                  </p>
                  <Link href="/login" className="btn-primary w-full mt-6 text-sm">
                    Unlock {exam.name.split(" ")[0]}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="py-20 sm:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-french to-brand-teal opacity-95" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-float" />
            <div className="absolute top-32 right-20 w-1.5 h-1.5 bg-brand-aqua rounded-full animate-float" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-20 left-1/3 w-1 h-1 bg-brand-frost rounded-full animate-float" style={{ animationDelay: "2s" }} />
          </div>

          <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white">
              Ready to ace your exams?
            </h2>
            <p className="text-brand-frost/60 mt-4 text-lg">
              Join thousands of students preparing smarter with CrysLearn.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 mt-8 bg-white text-brand-navy font-bold px-10 py-4 rounded-btn hover:shadow-[0_0_30px_rgba(0,180,216,0.4)] transition-all duration-300 text-lg">
              Get Started Free
            </Link>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="border-t border-brand-teal/10 dark:border-brand-frost/[0.05] py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="font-heading font-bold text-lg bg-gradient-to-r from-brand-teal via-brand-purple to-brand-surf bg-clip-text text-transparent">
              CrysLearn
            </span>
            <p className="text-xs text-text-muted/50 dark:text-text-dark-muted/50 mt-2">
              &copy; 2026 CrysLearn. Where exam success becomes crystal clear.
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
