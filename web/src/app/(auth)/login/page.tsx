"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError("Please enter your name");
          setLoading(false);
          return;
        }
        await signUpWithEmail(email, password, name);
        setSuccessMessage(
          "Account created! Check your email to confirm, then log in."
        );
      } else {
        await signInWithEmail(email, password);
        router.push(redirectTo);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-teal to-brand-purple rounded-btn flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-2xl text-text-primary dark:text-text-dark-primary">CrysLearn</span>
          </Link>
          <p className="mt-3 text-text-muted dark:text-text-dark-muted text-sm">
            {isSignUp
              ? "Create your account to start preparing"
              : "Welcome back! Log in to continue preparing"}
          </p>
        </div>

        {/* Form Card */}
        <div className="dash-card">
          {/* Error / Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-btn text-danger text-sm">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-btn text-success text-sm">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (sign up only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Enter your full name"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Please wait..."
                : isSignUp
                ? "Create Account"
                : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-brand-teal/10 dark:bg-brand-frost/10" />
            <span className="px-3 text-sm text-text-muted dark:text-text-dark-muted">or</span>
            <div className="flex-1 h-px bg-brand-teal/10 dark:bg-brand-frost/10" />
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 border border-brand-teal/20 dark:border-brand-frost/10 rounded-btn px-4 py-3 min-h-touch
                       hover:bg-brand-surf/5 transition-colors text-sm font-medium text-text-primary dark:text-text-dark-primary"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            Continue with Google
          </button>

          {/* Toggle sign up / sign in */}
          <p className="mt-6 text-center text-sm text-text-muted dark:text-text-dark-muted">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setSuccessMessage("");
              }}
              className="text-brand-surf font-semibold hover:underline"
            >
              {isSignUp ? "Log in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}


export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background-light" />}>
      <LoginForm />
    </Suspense>
  );
}
