"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { EXAMS } from "@shared/constants/exams";
import { ArrowLeft, CreditCard, Shield, CheckCircle2 } from "lucide-react";
import type { ExamSlug } from "@/types/database";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const examSlug = params.exam as ExamSlug;
  const exam = EXAMS[examSlug];

  if (!exam) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Exam not found.</p>
          <Link href="/dashboard" className="btn-primary mt-4 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!user) {
      router.push("/login?redirect=/pay/" + examSlug);
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Initialize payment via our API
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam_slug: examSlug,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment initialization failed");
      }

      // Redirect to Paystack checkout
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      {/* Header */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Exam Details */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Unlock {exam.name}
          </h1>
          <p className="text-gray-500 mt-2">{exam.fullName}</p>
        </div>

        {/* Payment Card */}
        <div className="card">
          {/* What you get */}
          <h2 className="font-semibold text-text-light mb-4">
            What&apos;s included:
          </h2>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              10+ years of past questions ({exam.subjects.length} subjects)
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              Unlimited timed mock exams ({exam.mockQuestionCount} questions,{" "}
              {exam.mockDurationMinutes} min)
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              AI-powered explanations for every answer
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              Subject-by-subject performance tracking
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              Offline download for study without internet
            </li>
          </ul>

          {/* Price */}
          <div className="border-t border-gray-100 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total (one-time)</span>
              <span className="text-2xl font-bold text-primary">
                {exam.priceFormatted}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              No subscriptions. Pay once, access forever.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-btn text-danger text-sm">
              {error}
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 disabled:opacity-50"
          >
            <CreditCard className="w-5 h-5" />
            {loading ? "Processing..." : `Pay ${exam.priceFormatted}`}
          </button>

          {/* Trust Signals */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Shield className="w-3 h-3" />
            Secured by Paystack. Supports cards, bank transfer & USSD.
          </div>
        </div>
      </div>
    </div>
  );
}
