"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

export default function SettingsPage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, updateProfileAsync, isUpdating, loading, error, refetch } = useProfile();
  const [name, setName] = useState("");
  const [nameEditing, setNameEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [actionError, setActionError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const displayName = profile?.name || user?.user_metadata?.full_name || "Name not set";

  const saveName = async (event: FormEvent) => {
    event.preventDefault();
    setFeedback("");
    setActionError("");
    if (!name.trim() || name.trim().length > 80) {
      setActionError("Enter a name between 1 and 80 characters.");
      return;
    }
    try {
      await updateProfileAsync({ name: name.trim() });
      setNameEditing(false);
      setFeedback("Your name has been updated.");
    } catch {
      setActionError("Your name could not be saved. Please try again.");
    }
  };

  const copyAccountId = async () => {
    if (!user) return;
    setActionError("");
    try {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      setFeedback("Account ID copied.");
    } catch {
      setActionError(
        "Your browser could not copy the ID. You can select it below and copy it manually.",
      );
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    setActionError("");
    try {
      await signOut();
    } catch {
      setActionError("You could not be signed out. Please try again.");
      setSigningOut(false);
    }
  };

  if (loading || authLoading)
    return (
      <p className="page-intro py-10" role="status">
        Loading your account…
      </p>
    );
  if (!user)
    return (
      <div className="dash-card max-w-xl">
        <h1 className="page-title">Your account, your space.</h1>
        <p className="page-intro mt-3">Sign in to manage your profile.</p>
        <Link href="/login" className="btn-primary mt-5">
          Sign in
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl space-y-7">
      <header>
        <p className="page-kicker">Make yourself at home</p>
        <h1 className="page-title">Your account.</h1>
        <p className="page-intro mt-3">The essentials that make CrysLearn yours.</p>
      </header>
      {error && (
        <div className="dash-card">
          <p role="alert" className="text-sm text-danger">
            Your profile could not be loaded. Account changes are unavailable until it loads.
          </p>
          <button className="btn-secondary mt-4" onClick={() => void refetch()}>
            Try again
          </button>
        </div>
      )}
      {actionError && (
        <p
          role="alert"
          className="rounded-btn border border-danger/30 bg-danger/5 p-4 text-sm text-danger"
        >
          {actionError}
        </p>
      )}
      {feedback && (
        <p
          role="status"
          className="flex items-center gap-2 text-sm text-brand-teal dark:text-brand-surf"
        >
          <Check size={16} />
          {feedback}
        </p>
      )}
      <section className="dash-card">
        <div className="mb-6 flex items-center gap-3">
          <UserRound size={22} strokeWidth={1.5} className="text-brand-teal dark:text-brand-surf" />
          <h2 className="font-heading text-xl font-bold text-text-primary dark:text-text-dark-primary">
            Profile details
          </h2>
        </div>
        <div className="divide-y divide-brand-teal/10 dark:divide-brand-frost/10">
          <div className="pb-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted dark:text-text-dark-muted">
              Your name
            </p>
            {nameEditing ? (
              <form onSubmit={saveName} className="space-y-3">
                <label htmlFor="display-name" className="sr-only">
                  Display name
                </label>
                <input
                  id="display-name"
                  autoComplete="name"
                  autoFocus
                  required
                  maxLength={80}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="input-field"
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={isUpdating || !name.trim()}
                    className="btn-primary"
                  >
                    {isUpdating ? "Saving…" : "Save name"}
                  </button>
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => {
                      setNameEditing(false);
                      setActionError("");
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <p className="break-words text-text-primary dark:text-text-dark-primary">
                  {displayName}
                </p>
                <button
                  className="btn-secondary shrink-0 px-4"
                  disabled={!!error || !profile}
                  onClick={() => {
                    setName(profile?.name || user.user_metadata?.full_name || "");
                    setNameEditing(true);
                    setFeedback("");
                    setActionError("");
                  }}
                >
                  Edit name
                </button>
              </div>
            )}
          </div>
          <div className="py-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted dark:text-text-dark-muted">
              Email address
            </p>
            <p className="break-all text-text-primary dark:text-text-dark-primary">
              {user.email || "No email address on this account"}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-5">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted dark:text-text-dark-muted">
                Account type
              </p>
              <p className="capitalize text-text-primary dark:text-text-dark-primary">
                {profile?.role || "Unavailable"}
              </p>
            </div>
            <Link
              href="/onboarding"
              className="inline-flex min-h-touch items-center gap-2 text-sm font-semibold text-brand-teal dark:text-brand-surf"
            >
              Choose account type
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section className="dash-card">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={22}
            strokeWidth={1.5}
            className="mt-1 shrink-0 text-brand-teal dark:text-brand-surf"
          />
          <div>
            <h2 className="font-heading text-xl font-bold text-text-primary dark:text-text-dark-primary">
              Your account ID
            </h2>
            <p
              id="account-id-description"
              className="mt-2 text-sm leading-relaxed text-text-muted dark:text-text-dark-muted"
            >
              This identifies your CrysLearn account. Parent sharing is not available yet; this ID
              does not provide access to student results.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="account-id" className="sr-only">
            Account ID
          </label>
          <input
            id="account-id"
            aria-describedby="account-id-description"
            value={user.id}
            readOnly
            className="input-field min-w-0 flex-1 font-mono text-xs"
            onFocus={(event) => event.target.select()}
          />
          <button className="btn-secondary shrink-0 gap-2" onClick={copyAccountId}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy ID"}
          </button>
        </div>
      </section>
      <section className="flex flex-wrap items-center justify-between gap-5 border-t border-brand-teal/15 py-5 dark:border-brand-frost/15">
        <div>
          <h2 className="font-heading text-xl font-bold text-text-primary dark:text-text-dark-primary">
            Finished for now?
          </h2>
          <p className="mt-2 text-sm text-text-muted dark:text-text-dark-muted">
            Your saved mock results will be here when you return.
          </p>
        </div>
        <button
          className="btn-secondary gap-2"
          disabled={signingOut}
          onClick={() => void handleSignOut()}
        >
          <LogOut size={16} />
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </section>
    </div>
  );
}
