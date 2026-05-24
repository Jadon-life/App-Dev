import Link from "next/link";
import { BookOpen, Clock, Brain, BarChart3, Wifi, Shield, Sparkles } from "lucide-react";

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
    description: "Complete question banks for JAMB, WAEC, NECO, and Post-UTME filtered by subject and year.",
  },
  {
    icon: Clock,
    title: "Timed Mock Exams",
    description: "Full exam simulations with automatic scoring and performance breakdown.",
  },
  {
    icon: Brain,
    title: "AI-Powered Explanations",
    description: "Every question has a clear, step-by-step solution so you understand why.",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description: "See your weak areas and track improvement over time, subject by subject.",
  },
  {
    icon: Wifi,
    title: "Offline Mode",
    description: "Download question packs and study without internet access.",
  },
  {
    icon: Shield,
    title: "Parent Dashboard",
    description: "Parents can track mock scores, study time, and weak subjects.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background-light">
      {/* Navigation */}
      <nav className="border-b border-purple-100/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-secondary to-accent-blue rounded-btn flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-xl text-primary">CrysLearn</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-text-light/70 hover:text-secondary transition-colors">
              Log in
            </Link>
            <Link href="/login" className="btn-primary text-sm">
              Start Preparing
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-accent-blue/10 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-pill px-4 py-1.5 mb-8">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">AI-powered exam preparation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary leading-tight">
            Learn with Clarity.
            <br />
            <span className="text-gradient">Score with Confidence.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-text-light/60 max-w-2xl mx-auto leading-relaxed">
            Where exam success becomes crystal clear. Prepare for JAMB, WAEC, NECO, 
            and Post-UTME with timed mock exams, AI-powered explanations, and performance tracking.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="btn-primary text-lg px-8 py-4 shadow-glow-lg">
              Start Preparing
            </Link>
            <a href="#features" className="btn-secondary text-lg px-8 py-4">
              See Features
            </a>
          </div>

          {/* Social proof */}
          <p className="mt-12 text-sm text-text-light/40">
            Trusted by students across Nigeria. Pay once, prep forever.
          </p>
        </div>
      </section>

      {/* Supported Exams */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-center text-2xl font-bold text-primary mb-3">
          Supported Exams
        </h2>
        <p className="text-center text-text-light/50 mb-10 text-sm">All the exams you need, in one place</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {exams.map((exam) => (
            <div key={exam.name} className="card-gradient text-center hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
              <h3 className="font-bold text-lg text-primary">{exam.name}</h3>
              <p className="text-sm text-text-light/50 mt-1">{exam.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gradient-subtle py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-primary mb-3">
            Everything You Need to Score High
          </h2>
          <p className="text-center text-text-light/50 mb-14 text-sm">Powerful tools designed for Nigerian students</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary/10 to-accent-blue/10 rounded-card flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg text-text-light">{feature.title}</h3>
                <p className="text-text-light/50 mt-2 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-center text-2xl font-bold text-primary mb-3">
          Simple, One-Time Pricing
        </h2>
        <p className="text-center text-text-light/50 mb-12 text-sm">
          No subscriptions. No hidden fees. Pay once and get lifetime access.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
          {exams.map((exam) => (
            <div key={exam.name} className="card text-center border-2 border-purple-100/50 hover:border-secondary/30 hover:shadow-glow transition-all duration-300">
              <h3 className="font-bold text-primary text-lg">{exam.name}</h3>
              <p className="text-3xl font-extrabold text-gradient mt-3">&#8358;3,500</p>
              <p className="text-sm text-text-light/40 mt-1">one-time payment</p>
              <Link href="/login" className="btn-primary w-full mt-5 text-sm">
                Unlock {exam.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-hero py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to ace your exams?
          </h2>
          <p className="text-white/60 mb-8">
            Join thousands of students who are preparing smarter with CrysLearn.
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-btn hover:shadow-elevated transition-all duration-200 hover:scale-[1.02]">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-100/50 bg-white py-10">
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
  );
}
