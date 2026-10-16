"use client";

import { Suspense, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { EXAMS } from "@shared/constants/exams";
import { isExamSlug, isPaymentReference, isPaystackCheckoutUrl } from "@/lib/payments/validation";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  CreditCard,
  Loader2,
  ShieldCheck,
} from "lucide-react";

function PaymentContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const inFlight = useRef(false);
  const examSlug = params.exam;
  const exam = isExamSlug(examSlug) ? EXAMS[examSlug] : null;
  const reference = searchParams.get("reference");
  const paymentPending = searchParams.get("payment") === "pending" && isPaymentReference(reference);

  if (!exam || !isExamSlug(examSlug)) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-6">
        <div className="text-center max-w-md">
          <p className="page-kicker">Exam access</p>
          <h1 className="page-title mt-3">We couldn&apos;t find that exam.</h1>
          <p className="page-intro mt-3">Choose an available exam to continue your preparation.</p>
          <Link href="/exams" className="btn-primary mt-6 inline-flex">
            Browse exams
          </Link>
        </div>
      </main>
    );
  }

  const handlePayment = async () => {
    if (inFlight.current || authLoading) return;
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/pay/${examSlug}`)}`);
      return;
    }
    inFlight.current = true;
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exam_slug: examSlug }),
        signal: AbortSignal.timeout(20_000),
      });
      const data = await response.json();
      if (response.status === 401) {
        router.push(`/login?redirect=${encodeURIComponent(`/pay/${examSlug}`)}`);
        return;
      }
      if (data.already_purchased) {
        setAlreadyPurchased(true);
        setLoading(false);
        return;
      }
      if (!response.ok)
        throw new Error(data.error || "We couldn't open checkout. Please try again.");
      if (!isPaystackCheckoutUrl(data.authorization_url)) {
        throw new Error("We couldn't open a secure checkout. Please try again.");
      }
      window.location.assign(data.authorization_url);
    } catch (err) {
      setError(
        err instanceof Error && err.name !== "TimeoutError"
          ? err.message
          : "Checkout took too long to respond. Please try again.",
      );
      setLoading(false);
    } finally {
      inFlight.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-primary dark:text-text-dark-primary">
      <header className="border-b border-brand-teal/15 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-4">
          <Link href="/home" className="font-heading text-xl font-bold tracking-tight">
            CrysLearn<span className="text-brand-teal dark:text-brand-surf">.</span>
          </Link>
          <Link
            href="/exams"
            className="inline-flex items-center gap-2 text-sm text-text-muted dark:text-text-dark-muted hover:text-brand-teal"
          >
            <ArrowLeft size={16} aria-hidden="true" /> All exams
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
        <p className="page-kicker">Your next step</p>
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-20 mt-4 items-start">
          <section aria-labelledby="payment-title">
            <h1 id="payment-title" className="page-title">
              Make room for
              <br className="hidden sm:block" /> better preparation.
            </h1>
            <p className="page-intro mt-5 max-w-md">
              One payment unlocks {exam.name} practice. Build confidence one question, one subject,
              and one mock exam at a time.
            </p>
            <div className="mt-9 pt-7 border-t border-brand-teal/15 dark:border-white/10">
              <div className="flex items-center gap-3 mb-5">
                <BookOpen
                  className="text-brand-teal dark:text-brand-surf"
                  size={20}
                  aria-hidden="true"
                />
                <h2 className="font-heading font-semibold">Inside your exam access</h2>
              </div>
              <ul className="space-y-4 text-sm text-text-muted dark:text-text-dark-muted">
                {[
                  `Past-question practice across ${exam.subjects.length} subjects`,
                  `Timed mocks: ${exam.mockQuestionCount} questions in ${exam.mockDurationMinutes} minutes`,
                  "Answer reviews with explanations",
                  "Your saved attempts and progress",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      size={17}
                      className="shrink-0 mt-0.5 text-brand-teal dark:text-brand-surf"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="dash-card p-6 sm:p-8" aria-labelledby="order-title">
            <p className="page-kicker">Exam access</p>
            <h2 id="order-title" className="font-heading text-2xl font-bold mt-3">
              {exam.name}
            </h2>
            <p className="text-sm text-text-muted dark:text-text-dark-muted mt-2 leading-relaxed">
              {exam.fullName}
            </p>
            <div className="flex justify-between items-end gap-3 border-y border-brand-teal/15 dark:border-white/10 my-7 py-6">
              <div>
                <p className="text-sm">One-time payment</p>
                <p className="text-xs text-text-muted dark:text-text-dark-muted mt-1">
                  No recurring charges
                </p>
              </div>
              <p className="font-heading text-3xl font-bold tracking-tight whitespace-nowrap">
                {exam.priceFormatted}
              </p>
            </div>

            {paymentPending && (
              <div
                role="status"
                className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed"
              >
                <p className="font-semibold">Your payment is confirmed.</p>
                <p className="mt-1">
                  We&apos;re still saving your exam access. Please don&apos;t pay again.
                </p>
                <a
                  href={`/api/payments/verify?reference=${encodeURIComponent(reference!)}`}
                  className="underline underline-offset-4 font-semibold inline-block mt-3"
                >
                  Check access again
                </a>
              </div>
            )}
            {error && (
              <p
                role="alert"
                className="mb-5 p-4 rounded-xl border border-red-500/25 bg-red-500/10 text-sm leading-relaxed"
              >
                {error}
              </p>
            )}
            {alreadyPurchased ? (
              <div role="status">
                <p className="text-sm mb-4">You already own this exam. Your practice is ready.</p>
                <Link
                  href={`/exams/${examSlug}/subjects`}
                  className="btn-primary w-full justify-center gap-2"
                >
                  Start practising <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>
            ) : !paymentPending ? (
              <button
                type="button"
                onClick={handlePayment}
                disabled={loading || authLoading}
                aria-busy={loading || authLoading}
                className="btn-primary w-full justify-center gap-2 py-3.5 disabled:opacity-60 disabled:cursor-wait"
              >
                {loading || authLoading ? (
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                ) : (
                  <CreditCard size={18} aria-hidden="true" />
                )}
                {authLoading
                  ? "Checking your account…"
                  : loading
                    ? "Opening secure checkout…"
                    : user
                      ? `Continue to pay ${exam.priceFormatted}`
                      : "Sign in to continue"}
              </button>
            ) : null}
            <div className="mt-5 flex items-start gap-2 text-xs text-text-muted dark:text-text-dark-muted leading-relaxed">
              <ShieldCheck size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
              <p>Pay securely with Paystack. Your card details stay with the payment provider.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center" role="status">
          Loading checkout…
        </main>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
