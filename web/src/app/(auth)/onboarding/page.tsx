"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { authErrorMessage, safeAuthRedirect } from "@/lib/auth-routing";
import { EXAMS, EXAM_SLUGS } from "@shared/constants/exams";
import { ArrowRight, Check, GraduationCap, ShieldCheck, Users } from "lucide-react";
import type { ExamSlug, UserRole } from "@/types/database";

function OnboardingForm() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<UserRole | null>(null);
  const [selectedExams, setSelectedExams] = useState<ExamSlug[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleExam = (slug: ExamSlug) =>
    setSelectedExams((previous) =>
      previous.includes(slug) ? previous.filter((exam) => exam !== slug) : [...previous, slug],
    );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saving) return;
    if (!role) return setError("Choose student or parent to continue.");
    if (role === "student" && selectedExams.length === 0)
      return setError("Choose at least one exam you're preparing for.");
    if (!user) return setError("Your session could not be loaded. Please sign in again.");
    setError("");
    setSaving(true);

    try {
      const name =
        String(
          user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "Learner",
        )
          .trim()
          .slice(0, 100) || "Learner";
      const { error: updateError } = await supabase
        .from("users")
        .update({ role, name })
        .eq("id", user.id)
        .select("id")
        .single();
      if (updateError) throw updateError;
      // Preferences are not entitlements; purchases continue to use server access records.
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          preferred_exams: role === "student" ? selectedExams : [],
          onboarding_completed: true,
        },
      });
      if (metadataError) throw metadataError;
      const destination = safeAuthRedirect(
        searchParams.get("next"),
        role === "parent" ? "/parent" : "/dashboard",
      );
      window.location.assign(
        destination === "/dashboard" && role === "parent" ? "/parent" : destination,
      );
    } catch (failure: unknown) {
      setError(authErrorMessage(failure, "We couldn't save your preferences. Please try again."));
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-background-light px-5 py-8 text-text-primary dark:bg-background-dark dark:text-text-dark-primary sm:py-12">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="mb-12 inline-flex items-center gap-2 text-lg font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-navy text-brand-aqua">
            C
          </span>
          CrysLearn
        </Link>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal dark:text-brand-aqua">
          Make it yours
        </p>
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          A good place to begin.
        </h1>
        <p className="mb-9 mt-4 max-w-md text-sm leading-6 text-text-muted dark:text-text-dark-muted">
          Tell us how you&apos;ll use CrysLearn. We&apos;ll keep your preparation focused on what
          matters to you.
        </p>
        {error && (
          <div
            id="onboarding-error"
            role="alert"
            className="mb-6 rounded-btn border border-danger/25 bg-danger/10 p-4 text-sm text-red-700 dark:text-red-300"
          >
            {error}{" "}
            {!user && (
              <Link href="/login" className="underline">
                Sign in
              </Link>
            )}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          aria-describedby={error ? "onboarding-error" : undefined}
          aria-busy={saving || authLoading}
          className="space-y-8"
        >
          <fieldset disabled={saving || authLoading}>
            <legend className="mb-4 text-sm font-semibold">I&apos;m here as a…</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(
                [
                  {
                    value: "student",
                    title: "Student",
                    description: "Build my confidence for exam day.",
                    Icon: GraduationCap,
                  },
                  {
                    value: "parent",
                    title: "Parent",
                    description: "Support my child's preparation.",
                    Icon: Users,
                  },
                ] as const
              ).map(({ value, title, description, Icon }) => (
                <label
                  key={value}
                  className={`relative flex cursor-pointer flex-col rounded-card border p-5 transition-colors focus-within:ring-2 focus-within:ring-brand-teal ${role === value ? "border-brand-teal bg-brand-teal/5 dark:border-brand-aqua" : "border-brand-teal/15 bg-surface-light hover:border-brand-teal/50 dark:border-white/15 dark:bg-surface-dark"}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={role === value}
                    onChange={() => setRole(value)}
                    className="sr-only"
                    required
                  />
                  <Icon
                    size={25}
                    className="mb-4 text-brand-teal dark:text-brand-aqua"
                    aria-hidden="true"
                  />
                  <span className="font-semibold">{title}</span>
                  <span className="mt-1 text-xs leading-5 text-text-muted dark:text-text-dark-muted">
                    {description}
                  </span>
                  {role === value && (
                    <Check
                      size={18}
                      className="absolute right-4 top-4 text-brand-teal dark:text-brand-aqua"
                      aria-hidden="true"
                    />
                  )}
                </label>
              ))}
            </div>
          </fieldset>
          {role === "student" && (
            <fieldset disabled={saving || authLoading}>
              <legend className="mb-1 text-sm font-semibold">What are you preparing for?</legend>
              <p className="mb-4 text-xs leading-5 text-text-muted dark:text-text-dark-muted">
                Choose one or more. You can explore every exam before purchasing access.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {EXAM_SLUGS.map((slug) => {
                  const selected = selectedExams.includes(slug);
                  return (
                    <button
                      key={slug}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleExam(slug)}
                      className={`relative min-h-24 rounded-btn border p-4 text-left transition-colors ${selected ? "border-brand-teal bg-brand-teal/5 dark:border-brand-aqua" : "border-brand-teal/15 bg-surface-light hover:border-brand-teal/50 dark:border-white/15 dark:bg-surface-dark"}`}
                    >
                      <span className="block pr-5 text-lg font-semibold">{EXAMS[slug].name}</span>
                      <span className="mt-1 block text-xs leading-5 text-text-muted dark:text-text-dark-muted">
                        {EXAMS[slug].fullName.split("(")[0].trim()}
                      </span>
                      {selected && (
                        <Check
                          size={17}
                          className="absolute right-3 top-4 text-brand-teal dark:text-brand-aqua"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}
          {role === "parent" && (
            <div className="flex gap-3 rounded-btn border border-brand-teal/15 bg-brand-teal/5 p-4 dark:border-white/15">
              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-brand-teal dark:text-brand-aqua"
                aria-hidden="true"
              />
              <div>
                <h2 className="text-sm font-semibold">Your child&apos;s privacy comes first.</h2>
                <p className="mt-1 text-xs leading-6 text-text-muted dark:text-text-dark-muted">
                  You can create your parent account now. Linking student progress needs a secure
                  approval flow and is not available yet.
                </p>
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={saving || authLoading || !role}
            className="btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving your preferences…"
              : authLoading
                ? "Loading your account…"
                : "Let's get started"}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center" aria-busy="true">
          <p role="status">Loading your preferences…</p>
        </main>
      }
    >
      <OnboardingForm />
    </Suspense>
  );
}
