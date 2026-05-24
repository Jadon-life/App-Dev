import Link from "next/link";
import { BookOpen, Clock, Brain, BarChart3, Wifi, Shield } from "lucide-react";

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
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-btn flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-xl text-primary">CrysLearn</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-text-light hover:text-primary transition-colors">
              Log in
            </Link>
            <Link href="/login" className="btn-primary text-sm">
              Start Preparing
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight">
          Crystal-Clear Learning for
          <br />
          <span className="text-secondary">Exam Success</span> in Nigeria
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Prepare for JAMB, WAEC, NECO, and Post-UTME with timed mock exams, 
          AI-powered explanations, and performance tracking. Pay once, prep forever.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="btn-primary text-lg px-8 py-4">
            Start Preparing
          </Link>
          <a href="#features" className="btn-secondary text-lg px-8 py-4">
            See Features
          </a>
        </div>
      </section>

      {/* Supported Exams */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-center text-2xl font-bold text-primary mb-10">
          Supported Exams
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {exams.map((exam) => (
            <div key={exam.name} className="card text-center hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-primary">{exam.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{exam.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-primary mb-12">
            Everything You Need to Score High
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="card hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-secondary/10 rounded-card flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg text-text-light">{feature.title}</h3>
                <p className="text-gray-500 mt-2 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-center text-2xl font-bold text-primary mb-4">
          Simple, One-Time Pricing
        </h2>
        <p className="text-center text-gray-600 mb-10">
          No subscriptions. Pay once per exam and get lifetime access to all content.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {exams.map((exam) => (
            <div key={exam.name} className="card text-center border-2 border-gray-100 hover:border-secondary transition-colors">
              <h3 className="font-bold text-primary text-lg">{exam.name}</h3>
              <p className="text-3xl font-bold text-secondary mt-3">&#8358;3,500</p>
              <p className="text-sm text-gray-500 mt-1">one-time payment</p>
              <Link href="/login" className="btn-primary w-full mt-4 text-sm">
                Unlock {exam.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; 2025 CrysLearn. Crystal-clear learning for exam success in Nigeria.</p>
        </div>
      </footer>
    </div>
  );
}
