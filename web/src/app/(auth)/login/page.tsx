"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { authErrorMessage, safeAuthRedirect } from "@/lib/auth-routing";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";

const callbackErrors: Record<string, string> = {
  auth_callback_failed: "We couldn't complete sign-in. Please try again from this page.",
  auth_unavailable: "Sign-in is temporarily unavailable. Please try again in a moment.",
  session_expired: "Your session has expired. Sign in again to continue.",
  configuration: "Sign-in is not configured yet. Please try again once the service is available.",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(callbackErrors[searchParams.get("error") || ""] || "");
  const [loading, setLoading] = useState<"email" | "google" | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, error: sessionError } = useAuth();
  const redirectTo = safeAuthRedirect(searchParams.get("redirect"));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    setSuccessMessage("");
    setLoading("email");
    try {
      if (isSignUp) {
        if (!name.trim()) throw new Error("Please enter your name.");
        const data = await signUpWithEmail(email, password, name);
        if (data.session) {
          window.location.assign("/onboarding");
          return;
        }
        setSuccessMessage(
          "Check your email for a confirmation link. Once confirmed, you can sign in here.",
        );
      } else {
        const { user } = await signInWithEmail(email, password);
        // A navigation reads the freshly written auth cookies in middleware.
        if (!user?.user_metadata?.onboarding_completed) {
          window.location.assign(`/onboarding?next=${encodeURIComponent(redirectTo)}`);
          return;
        }
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();
        if (profileError)
          throw new Error(
            "You're signed in, but your profile couldn't be loaded. Please try again.",
          );
        window.location.assign(
          redirectTo === "/dashboard" && profile.role === "parent" ? "/parent" : redirectTo,
        );
      }
    } catch (failure: unknown) {
      setError(authErrorMessage(failure, "We couldn't sign you in. Please try again."));
    } finally {
      setLoading(null);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setError("");
    setSuccessMessage("");
    setLoading("google");
    try {
      await signInWithGoogle(redirectTo);
    } catch (failure: unknown) {
      setError(authErrorMessage(failure, "Google sign-in failed. Please try again."));
      setLoading(null);
    }
  };

  const displayedError = error || sessionError;

  return (
    <main className="min-h-screen bg-background-light text-text-primary dark:bg-background-dark dark:text-text-dark-primary lg:grid lg:grid-cols-[1fr_1.05fr]">
      <aside className="relative hidden overflow-hidden bg-brand-navy px-12 py-10 text-white lg:flex lg:flex-col xl:px-20">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2.5 text-xl font-bold tracking-tight"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/25 text-brand-aqua">
            C
          </span>
          CrysLearn
        </Link>
        <div className="my-auto py-20">
          <span className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-aqua">
            <BookOpen size={15} aria-hidden="true" /> Your next chapter
          </span>
          <h1 className="max-w-md font-heading text-6xl font-bold leading-[1.05] tracking-tight">
            A clear head.
            <br />
            <span className="text-brand-aqua">A stronger score.</span>
          </h1>
          <p className="mt-6 max-w-sm text-base leading-7 text-white/70">
            A place to practise, understand what needs work, and build confidence for exam day.
          </p>
          <ol className="mt-12 max-w-sm space-y-5 border-t border-white/15 pt-7">
            {[
              "Choose the exam you're working towards",
              "Practise with past questions and timed mocks",
              "See your results. Know your next step.",
            ].map((step, index) => (
              <li key={step} className="flex items-start gap-4 text-sm leading-6 text-white/80">
                <span className="font-mono text-xs leading-6 text-brand-aqua">0{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
        <p className="text-xs tracking-wide text-white/45">Built for the way you learn.</p>
      </aside>

      <section className="flex min-h-screen flex-col px-5 py-7 sm:px-10">
        <Link
          href="/"
          className="inline-flex min-h-11 w-fit items-center gap-2 text-sm text-text-muted hover:text-brand-teal dark:text-text-dark-muted"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to CrysLearn
        </Link>
        <div className="mx-auto my-auto w-full max-w-md py-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-teal dark:text-brand-aqua">
            {isSignUp ? "Start with one small step" : "Good to see you again"}
          </p>
          <h2 className="font-heading text-4xl font-bold tracking-tight">
            {isSignUp ? "Make room for progress." : "Back to your preparation."}
          </h2>
          <p className="mb-8 mt-3 text-sm leading-6 text-text-muted dark:text-text-dark-muted">
            {isSignUp
              ? "Create an account to keep your practice and results in one place."
              : "Sign in to pick up where you left off."}
          </p>

          {displayedError && (
            <div
              id="auth-error"
              role="alert"
              className="mb-5 rounded-btn border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
            >
              {displayedError}
            </div>
          )}
          {successMessage && (
            <div
              role="status"
              className="mb-5 flex gap-2 rounded-btn border border-success/25 bg-success/10 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-300"
            >
              <Check size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              {successMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            aria-describedby={displayedError ? "auth-error" : undefined}
            aria-busy={loading === "email"}
          >
            <fieldset disabled={loading !== null} className="space-y-5 disabled:opacity-75">
              <legend className="sr-only">
                {isSignUp ? "Create your account" : "Sign in with email"}
              </legend>
              {isSignUp && (
                <div>
                  <label htmlFor="auth-name" className="mb-2 block text-sm font-medium">
                    Full name
                  </label>
                  <div className="relative">
                    <User
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                      aria-hidden="true"
                    />
                    <input
                      id="auth-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      maxLength={100}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="input-field pl-10"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="auth-email" className="mb-2 block text-sm font-medium">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                    aria-hidden="true"
                  />
                  <input
                    id="auth-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="input-field pl-10"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="auth-password" className="mb-2 block text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                    aria-hidden="true"
                  />
                  <input
                    id="auth-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="input-field pl-10 pr-12"
                    minLength={isSignUp ? 8 : undefined}
                    aria-describedby={isSignUp ? "password-hint" : undefined}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-text-muted hover:text-brand-teal"
                  >
                    {showPassword ? (
                      <EyeOff size={18} aria-hidden="true" />
                    ) : (
                      <Eye size={18} aria-hidden="true" />
                    )}
                  </button>
                </div>
                {isSignUp && (
                  <p
                    id="password-hint"
                    className="mt-2 text-xs text-text-muted dark:text-text-dark-muted"
                  >
                    Use at least 8 characters.
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-wait"
              >
                {loading === "email" ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </fieldset>
          </form>

          <div className="my-6 flex items-center gap-4" aria-hidden="true">
            <span className="h-px flex-1 bg-brand-teal/15 dark:bg-white/10" />
            <span className="text-xs text-text-muted dark:text-text-dark-muted">or</span>
            <span className="h-px flex-1 bg-brand-teal/15 dark:bg-white/10" />
          </div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading !== null}
            className="flex min-h-12 w-full items-center justify-center gap-3 rounded-btn border border-brand-teal/20 px-4 py-3 text-sm font-medium transition-colors hover:bg-brand-teal/5 disabled:cursor-wait disabled:opacity-60 dark:border-white/15 dark:hover:bg-white/5"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {loading === "google" ? "Opening Google…" : "Continue with Google"}
          </button>
          <p className="mt-7 text-center text-sm text-text-muted dark:text-text-dark-muted">
            {isSignUp ? "Already have an account?" : "New to CrysLearn?"}{" "}
            <button
              type="button"
              disabled={loading !== null}
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setSuccessMessage("");
              }}
              className="min-h-11 font-semibold text-brand-teal underline-offset-4 hover:underline dark:text-brand-aqua"
            >
              {isSignUp ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
        <p className="text-center text-xs text-text-muted dark:text-text-dark-muted">
          Your preparation, one question at a time.
        </p>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main
          className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark"
          aria-busy="true"
        >
          <p role="status">Loading sign-in…</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
