import Link from "next/link";
import { BookOpen, Clock, Brain, BarChart3, Wifi, Shield, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic imports for client-only components (Three.js + GSAP)
const FloatingCrystal = dynamic(
  () => import("@/components/three/FloatingCrystal"),
  { ssr: false }
);
const HeroCarousel = dynamic(
  () => import("@/components/animations/HeroCarousel"),
  { ssr: false }
);
const GSAPProvider = dynamic(
  () => import("@/components/animations/GSAPProvider"),
  { ssr: false }
);
const MagneticButton = dynamic(
  () => import("@/components/animations/MagneticButton"),
  { ssr: false }
);
const TiltCard = dynamic(
  () => import("@/components/animations/TiltCard"),
  { ssr: false }
);

const exams = [
  { name: "JAMB", description: "Unified Tertiary Matriculation Examination" },
  { name: "WAEC", description: "West African Senior School Certificate" },
  { name: "NECO", description: "National Examinations Council" },
  { name: "Post-UTME", description: "University Post-UTME Screening" },
];

const features = [
  {
    icon: BookOpen,
    title: "10+ Years Past Questions",
    description: "Complete question banks filtered by subject and year.",
  },
  {
    icon: Clock,
    title: "Timed Mock Exams",
    description: "Full simulations with automatic scoring and breakdowns.",
  },
  {
    icon: Brain,
    title: "AI-Powered Explanations",
    description: "Step-by-step solutions so you understand the why.",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description: "Track improvement over time, subject by subject.",
  },
  {
    icon: Wifi,
    title: "Offline Mode",
    description: "Download question packs for study without internet.",
  },
  {
    icon: Shield,
    title: "Parent Dashboard",
    description: "Parents track mock scores, study time, and weak subjects.",
  },
];

export default function LandingPage() {
  return (
    <GSAPProvider>
      <div className="min-h-screen bg-background-light overflow-hidden">
        {/* Navigation */}
        <nav className="border-b border-purple-100/50 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-secondary to-accent-blue rounded-btn flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-xl text-primary">CrysLearn</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm text-text-light/70 hover:text-secondary transition-colors"
              >
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

        {/* ═══════════════════════════════════════════════════════════
            HERO SECTION — Cinematic with 3D Crystal + Carousel
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[90vh] flex items-center">
          {/* 3D Crystal Background */}
          <FloatingCrystal />

          {/* Gradient orbs */}
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-secondary/8 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-accent-blue/8 rounded-full blur-[100px]" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
            <div className="text-center">
              {/* Badge */}
              <div
                data-gsap="fade-up"
                className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-pill px-4 py-1.5 mb-8"
              >
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">
                  AI-powered exam preparation
                </span>
              </div>

              {/* Main Headline */}
              <h1
                data-gsap="fade-up"
                className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-primary leading-[1.1] tracking-tight"
              >
                Learn with Clarity.
                <br />
                <span className="text-gradient">Score with Confidence.</span>
              </h1>

              <p
                data-gsap="fade-up"
                className="mt-6 text-lg sm:text-xl text-text-light/50 max-w-2xl mx-auto leading-relaxed"
              >
                Where exam success becomes crystal clear.
              </p>

              {/* CTA Buttons */}
              <div data-gsap="fade-up" className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticButton>
                  <Link
                    href="/login"
                    className="btn-primary text-lg px-10 py-4 shadow-glow-lg"
                  >
                    Start Preparing
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <a href="#features" className="btn-secondary text-lg px-10 py-4">
                    See Features
                  </a>
                </MagneticButton>
              </div>

              {/* Cinematic Carousel */}
              <div data-gsap="fade-up" className="mt-16 max-w-2xl mx-auto">
                <HeroCarousel />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SUPPORTED EXAMS
        ═══════════════════════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div data-gsap="fade-up" className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">
              Supported Exams
            </h2>
            <p className="text-text-light/50 mt-2 text-sm">
              All the exams you need, in one place
            </p>
          </div>
          <div data-gsap="stagger" className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {exams.map((exam) => (
              <TiltCard key={exam.name}>
                <div className="card-gradient text-center h-full hover:shadow-glow transition-all duration-500">
                  <h3 className="font-bold text-xl text-primary">{exam.name}</h3>
                  <p className="text-sm text-text-light/50 mt-2">{exam.description}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FEATURES
        ═══════════════════════════════════════════════════════════ */}
        <section id="features" className="bg-gradient-subtle py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div data-gsap="fade-up" className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                Everything You Need to Score High
              </h2>
              <p className="text-text-light/50 mt-2 text-sm">
                Powerful tools designed for Nigerian students
              </p>
            </div>
            <div data-gsap="stagger" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <TiltCard key={feature.title}>
                  <div className="card h-full group">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary/10 to-accent-blue/10 rounded-card flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow duration-500">
                      <feature.icon className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="font-semibold text-lg text-text-light">
                      {feature.title}
                    </h3>
                    <p className="text-text-light/50 mt-2 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            PRICING
        ═══════════════════════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div data-gsap="fade-up" className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">
              Simple, One-Time Pricing
            </h2>
            <p className="text-text-light/50 mt-2 text-sm">
              No subscriptions. No hidden fees. Pay once and get lifetime access.
            </p>
          </div>
          <div
            data-gsap="stagger"
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto"
          >
            {exams.map((exam) => (
              <TiltCard key={exam.name}>
                <div className="card text-center border-2 border-purple-100/50 hover:border-secondary/40 hover:shadow-glow transition-all duration-500 h-full">
                  <h3 className="font-bold text-primary text-lg">{exam.name}</h3>
                  <p className="text-3xl font-extrabold text-gradient mt-3">
                    &#8358;3,500
                  </p>
                  <p className="text-sm text-text-light/40 mt-1">one-time payment</p>
                  <MagneticButton>
                    <Link href="/login" className="btn-primary w-full mt-5 text-sm">
                      Unlock {exam.name}
                    </Link>
                  </MagneticButton>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            CTA SECTION — Dark gradient
        ═══════════════════════════════════════════════════════════ */}
        <section data-gsap="scale-in" className="bg-gradient-hero py-24 relative overflow-hidden">
          {/* Floating particles effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-float" />
            <div className="absolute top-32 right-20 w-1.5 h-1.5 bg-purple-300 rounded-full animate-float" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-20 left-1/3 w-1 h-1 bg-blue-300 rounded-full animate-float" style={{ animationDelay: "2s" }} />
            <div className="absolute top-20 right-1/3 w-2 h-2 bg-indigo-300 rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
          </div>

          <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to ace your exams?
            </h2>
            <p className="text-white/50 mb-10 text-lg">
              Join thousands of students preparing smarter with CrysLearn.
            </p>
            <MagneticButton>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-white text-primary font-bold px-10 py-4 rounded-btn hover:shadow-elevated transition-all duration-300 text-lg"
              >
                Get Started Free
              </Link>
            </MagneticButton>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════════════════ */}
        <footer className="border-t border-purple-100/50 bg-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-secondary to-accent-blue rounded-btn flex items-center justify-center">
                <span className="text-white font-bold text-xs">C</span>
              </div>
              <span className="font-bold text-lg text-primary">CrysLearn</span>
            </div>
            <p className="text-sm text-text-light/40">
              &copy; 2025 CrysLearn. Where exam success becomes crystal clear.
            </p>
          </div>
        </footer>
      </div>
    </GSAPProvider>
  );
}
