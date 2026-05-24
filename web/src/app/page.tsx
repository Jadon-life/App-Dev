import Link from "next/link";
import { BookOpen, Clock, Brain, BarChart3, Wifi, Shield } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic imports — client-only components (Three.js/GSAP need browser APIs)
const ReactiveBackground = dynamic(() => import("@/components/three/ReactiveBackground"), { ssr: false });
const FloatingCrystal = dynamic(() => import("@/components/three/FloatingCrystal"), { ssr: false });
const GlassCarousel = dynamic(() => import("@/components/hero/GlassCarousel"), { ssr: false });
const ScrollEngine = dynamic(() => import("@/components/animations/ScrollEngine"), { ssr: false });
const TiltCard = dynamic(() => import("@/components/animations/TiltCard"), { ssr: false });
const MagneticButton = dynamic(() => import("@/components/animations/MagneticButton"), { ssr: false });
const ThemeToggle = dynamic(() => import("@/components/theme/ThemeToggle"), { ssr: false });
const ThemeProvider = dynamic(() => import("@/components/theme/ThemeContext").then(m => ({ default: m.ThemeProvider })), { ssr: false });

// Only showing JAMB and WAEC for now (NECO and Post-UTME kept in codebase but hidden)
const visibleExams = [
  { name: "JAMB (UTME)", slug: "jamb", description: "Unified Tertiary Matriculation Examination", price: "3,500" },
  { name: "WAEC", slug: "waec", description: "West African Senior School Certificate Examination", price: "3,500" },
];

const features = [
  { icon: BookOpen, title: "10+ Years Past Questions", description: "Complete question banks filtered by subject and year." },
  { icon: Clock, title: "Timed Mock Exams", description: "Full simulations with automatic scoring and breakdown." },
  { icon: Brain, title: "AI-Powered Explanations", description: "Step-by-step solutions so you understand the why." },
  { icon: BarChart3, title: "Performance Tracking", description: "Track improvement over time, subject by subject." },
  { icon: Wifi, title: "Offline Mode", description: "Download question packs for study without internet." },
  { icon: Shield, title: "Parent Dashboard", description: "Parents track scores, study time, and weak areas." },
];

export default function LandingPage() {
  return (
    <ThemeProvider>
      {/* Reactive WebGL background */}
      <ReactiveBackground />

      <ScrollEngine>
        <div className="relative min-h-screen">
          {/* ═══ NAVIGATION ═══ */}
          <nav className="fixed top-0 left-0 right-0 z-50 border-b border-indigo-200/20 dark:border-white/[0.06] bg-white/70 dark:bg-[#0c0820]/70 backdrop-blur-2xl">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              {/* Logo wordmark — gradient + glow, no icon box */}
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-500 dark:from-indigo-300 dark:via-purple-300 dark:to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(124,58,237,0.3)]">
                  CrysLearn
                </span>
              </Link>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link href="/login" className="text-sm text-indigo-900/70 dark:text-indigo-200/70 hover:text-purple-600 dark:hover:text-purple-300 transition-colors hidden sm:block">
                  Log in
                </Link>
                <MagneticButton>
                  <Link href="/login" className="btn-primary text-sm">
                    Start Preparing
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </nav>

          {/* ═══ HERO SECTION — 3D Crystal + Glass Carousel ═══ */}
          <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
            {/* 3D Crystal behind hero */}
            <div className="absolute inset-0">
              <FloatingCrystal />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 w-full">
              {/* Headline */}
              <div data-scroll="fade-up" className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-indigo-950 dark:text-white">
                  Learn with Clarity.
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 dark:from-purple-400 dark:via-indigo-300 dark:to-blue-400 bg-clip-text text-transparent">
                    Score with Confidence.
                  </span>
                </h1>
                <p className="mt-5 text-base sm:text-lg text-indigo-900/60 dark:text-indigo-200/60 max-w-xl mx-auto leading-relaxed">
                  Where exam success becomes crystal clear. Prepare for JAMB and WAEC with timed mock exams, AI explanations, and performance tracking.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <MagneticButton>
                    <Link href="/login" className="btn-primary text-base px-8 py-3.5">
                      Start Preparing
                    </Link>
                  </MagneticButton>
                  <MagneticButton>
                    <a href="#features" className="btn-secondary text-base px-8 py-3.5">
                      Explore Features
                    </a>
                  </MagneticButton>
                </div>
              </div>

              {/* Glassmorphism Carousel */}
              <div data-scroll="fade-up">
                <GlassCarousel />
              </div>
            </div>
          </section>

          {/* ═══ SUPPORTED EXAMS ═══ */}
          <section className="relative py-24 overflow-hidden">
            <div data-parallax-speed="0.2" className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]">
              <div className="absolute top-10 right-10 w-64 h-64 border border-purple-500 rounded-full" />
              <div className="absolute bottom-10 left-10 w-48 h-48 border border-blue-500 rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div data-scroll="fade-up" className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-indigo-950 dark:text-white">
                  Supported Exams
                </h2>
                <p className="text-indigo-900/50 dark:text-indigo-200/50 mt-2">All the exams you need, in one place</p>
              </div>
              <div data-stagger="true" className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {visibleExams.map((exam) => (
                  <TiltCard key={exam.slug}>
                    <div className="relative overflow-hidden rounded-2xl border border-indigo-200/40 dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl p-8 text-center shadow-lg dark:shadow-purple-900/10 hover:border-purple-400/50 dark:hover:border-purple-500/30 hover:shadow-purple-500/10 transition-all duration-500">
                      <h3 className="font-bold text-2xl text-indigo-950 dark:text-white">{exam.name}</h3>
                      <p className="text-sm text-indigo-800/50 dark:text-indigo-200/50 mt-2">{exam.description}</p>
                      <p className="text-3xl font-extrabold mt-4 bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                        &#8358;{exam.price}
                      </p>
                      <p className="text-xs text-indigo-800/40 dark:text-indigo-300/40 mt-1">one-time payment</p>
                      <MagneticButton>
                        <Link href="/login" className="btn-primary w-full mt-5 text-sm">
                          Unlock {exam.name}
                        </Link>
                      </MagneticButton>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ FEATURES ═══ */}
          <section id="features" data-pin="true" className="relative min-h-screen flex items-center py-28">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div data-pin-animate="fade-scale" className="text-center mb-14">
                <h2 className="text-2xl sm:text-3xl font-bold text-indigo-950 dark:text-white">
                  Everything You Need to Score High
                </h2>
                <p className="text-indigo-900/50 dark:text-indigo-200/50 mt-2">Powerful tools designed for Nigerian students</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {features.map((feature) => (
                  <div key={feature.title} data-pin-animate="slide-up">
                    <TiltCard>
                      <div className="rounded-2xl border border-indigo-200/30 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl p-6 h-full group hover:border-purple-400/40 dark:hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-500">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 flex items-center justify-center mb-4 group-hover:shadow-[0_0_16px_rgba(124,58,237,0.2)] transition-shadow duration-500">
                          <feature.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="font-semibold text-base text-indigo-950 dark:text-white">{feature.title}</h3>
                        <p className="text-indigo-800/50 dark:text-indigo-200/50 mt-2 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </TiltCard>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ CTA SECTION ═══ */}
          <section data-scroll="scale-in" className="relative py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 dark:from-[#0c0820] dark:via-purple-950 dark:to-indigo-950" />
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-float" />
              <div className="absolute top-32 right-20 w-1.5 h-1.5 bg-purple-300 rounded-full animate-float" style={{ animationDelay: "1s" }} />
              <div className="absolute bottom-20 left-1/3 w-1 h-1 bg-blue-300 rounded-full animate-float" style={{ animationDelay: "2s" }} />
            </div>
            <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to ace your exams?
              </h2>
              <p className="text-indigo-200/60 mb-10 text-lg">
                Join thousands of students preparing smarter with CrysLearn.
              </p>
              <MagneticButton>
                <Link href="/login" className="inline-flex items-center gap-2 bg-white text-indigo-900 font-bold px-10 py-4 rounded-xl hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all duration-300 text-lg">
                  Get Started Free
                </Link>
              </MagneticButton>
            </div>
          </section>

          {/* ═══ FOOTER ═══ */}
          <footer className="border-t border-indigo-200/20 dark:border-white/[0.05] bg-white/50 dark:bg-[#0c0820]/50 backdrop-blur-sm py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-500 dark:from-indigo-300 dark:via-purple-300 dark:to-blue-400 bg-clip-text text-transparent">
                CrysLearn
              </span>
              <p className="text-sm text-indigo-800/40 dark:text-indigo-300/40 mt-2">
                &copy; 2026 CrysLearn. Where exam success becomes crystal clear.
              </p>
            </div>
          </footer>
        </div>
      </ScrollEngine>
    </ThemeProvider>
  );
}
