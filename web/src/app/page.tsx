import Link from "next/link";
import { BookOpen, Clock, Brain, BarChart3, Wifi, Shield } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic imports — client-only components (Three.js/GSAP need browser APIs)
const ReactiveBackground = dynamic(() => import("@/components/three/ReactiveBackground"), { ssr: false });
const FloatingCrystal = dynamic(() => import("@/components/three/FloatingCrystal"), { ssr: false });
const CinematicHero = dynamic(() => import("@/components/hero/CinematicHero"), { ssr: false });
const ScrollEngine = dynamic(() => import("@/components/animations/ScrollEngine"), { ssr: false });
const TiltCard = dynamic(() => import("@/components/animations/TiltCard"), { ssr: false });
const MagneticButton = dynamic(() => import("@/components/animations/MagneticButton"), { ssr: false });
const ThemeToggle = dynamic(() => import("@/components/theme/ThemeToggle"), { ssr: false });
const ThemeProvider = dynamic(() => import("@/components/theme/ThemeContext").then(m => ({ default: m.ThemeProvider })), { ssr: false });

const exams = [
  { name: "JAMB", description: "Unified Tertiary Matriculation Examination", price: "3,500" },
  { name: "WAEC", description: "West African Senior School Certificate", price: "3,500" },
  { name: "NECO", description: "National Examinations Council", price: "3,500" },
  { name: "Post-UTME", description: "University Post-UTME Screening", price: "5,000" },
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
      {/* Reactive WebGL background — follows mouse, shifts with scroll */}
      <ReactiveBackground />

      <ScrollEngine>
        <div className="relative min-h-screen">
          {/* ═══ NAVIGATION ═══ */}
          <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-white/5 dark:bg-black/5 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gradient-to-br from-secondary to-accent-blue rounded-btn flex items-center justify-center shadow-glow">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="font-bold text-xl text-primary dark:text-white">CrysLearn</span>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link href="/login" className="text-sm text-text-light/60 dark:text-text-dark/60 hover:text-secondary transition-colors hidden sm:block">
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

          {/* ═══ CINEMATIC HERO SECTION ═══ */}
          <CinematicHero />
          {/* 3D Crystal floating behind hero */}
          <div className="absolute inset-0 top-16">
            <FloatingCrystal />
          </div>

          {/* ═══ SUPPORTED EXAMS — Multi-layer parallax ═══ */}
          <section className="relative py-28 overflow-hidden">
            {/* Background layer (moves slower) */}
            <div data-parallax-speed="0.2" className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-64 h-64 border border-secondary/30 rounded-full" />
              <div className="absolute bottom-10 left-10 w-48 h-48 border border-accent-blue/20 rounded-full" />
            </div>

            {/* Midground content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div data-scroll="fade-up" className="text-center mb-14">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary dark:text-white">
                  Supported Exams
                </h2>
                <p className="text-text-light/50 dark:text-text-dark/50 mt-2">All the exams you need, in one place</p>
              </div>
              <div data-stagger="true" className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {exams.map((exam) => (
                  <TiltCard key={exam.name}>
                    <div className="card-gradient text-center h-full">
                      <h3 className="font-bold text-xl text-primary dark:text-white">{exam.name}</h3>
                      <p className="text-sm text-text-light/50 dark:text-text-dark/50 mt-2">{exam.description}</p>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ FEATURES — Scroll-pinned reveal ═══ */}
          <section id="features" data-pin="true" className="relative min-h-screen flex items-center bg-gradient-subtle dark:bg-transparent py-28">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div data-pin-animate="fade-scale" className="text-center mb-14">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary dark:text-white">
                  Everything You Need to Score High
                </h2>
                <p className="text-text-light/50 dark:text-text-dark/50 mt-2">Powerful tools designed for Nigerian students</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, i) => (
                  <div key={feature.title} data-pin-animate="slide-up">
                    <TiltCard>
                      <div className="card h-full group">
                        <div className="w-12 h-12 bg-gradient-to-br from-secondary/10 to-accent-blue/10 rounded-card flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow duration-500">
                          <feature.icon className="w-6 h-6 text-secondary" />
                        </div>
                        <h3 className="font-semibold text-lg text-text-light dark:text-text-dark">{feature.title}</h3>
                        <p className="text-text-light/50 dark:text-text-dark/50 mt-2 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </TiltCard>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ PRICING — Parallax depth layers ═══ */}
          <section className="relative py-28 overflow-hidden">
            <div data-parallax-speed="0.15" className="absolute top-0 left-0 w-full h-full opacity-5">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-secondary rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div data-scroll="fade-up" className="text-center mb-14">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary dark:text-white">
                  Simple, One-Time Pricing
                </h2>
                <p className="text-text-light/50 dark:text-text-dark/50 mt-2">
                  No subscriptions. Pay once and get lifetime access.
                </p>
              </div>
              <div data-stagger="true" className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
                {exams.map((exam) => (
                  <TiltCard key={exam.name}>
                    <div className="card text-center border-2 border-purple-100/50 dark:border-white/5 hover:border-secondary/40 hover:shadow-glow transition-all duration-500 h-full">
                      <h3 className="font-bold text-primary dark:text-white text-lg">{exam.name}</h3>
                      <p className="text-3xl font-extrabold text-gradient mt-3">&#8358;{exam.price}</p>
                      <p className="text-sm text-text-light/40 dark:text-text-dark/40 mt-1">one-time payment</p>
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

          {/* ═══ CTA SECTION ═══ */}
          <section data-scroll="scale-in" className="bg-gradient-hero py-24 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-float" />
              <div className="absolute top-32 right-20 w-1.5 h-1.5 bg-purple-300 rounded-full animate-float" style={{ animationDelay: "1s" }} />
              <div className="absolute bottom-20 left-1/3 w-1 h-1 bg-blue-300 rounded-full animate-float" style={{ animationDelay: "2s" }} />
            </div>
            <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to ace your exams?
              </h2>
              <p className="text-white/50 mb-10 text-lg">
                Join thousands of students preparing smarter with CrysLearn.
              </p>
              <MagneticButton>
                <Link href="/login" className="inline-flex items-center gap-2 bg-white text-primary font-bold px-10 py-4 rounded-btn hover:shadow-elevated transition-all duration-300 text-lg">
                  Get Started Free
                </Link>
              </MagneticButton>
            </div>
          </section>

          {/* ═══ FOOTER ═══ */}
          <footer className="border-t border-purple-100/50 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="flex items-center justify-center gap-2.5 mb-3">
                <div className="w-7 h-7 bg-gradient-to-br from-secondary to-accent-blue rounded-btn flex items-center justify-center">
                  <span className="text-white font-bold text-xs">C</span>
                </div>
                <span className="font-bold text-lg text-primary dark:text-white">CrysLearn</span>
              </div>
              <p className="text-sm text-text-light/40 dark:text-text-dark/40">
                &copy; 2025 CrysLearn. Where exam success becomes crystal clear.
              </p>
            </div>
          </footer>
        </div>
      </ScrollEngine>
    </ThemeProvider>
  );
}
