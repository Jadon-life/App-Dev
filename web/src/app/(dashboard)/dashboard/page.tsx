"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useExamAccess } from "@/hooks/useProfile";
import { EXAMS, EXAM_SLUGS } from "@shared/constants/exams";
import { Lock, ArrowRight, BookOpen, Clock, Trophy } from "lucide-react";
import type { ExamSlug } from "@/types/database";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: accessData, isLoading } = useExamAccess();

  const unlockedExamIds = new Set(
    accessData?.map((a: any) => a.exam_id) || []
  );

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Student";

  const hasUnlockedExams = unlockedExamIds.size > 0;

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">
          Welcome back, {userName}
        </h1>
        <p className="text-gray-500 mt-1">
          {hasUnlockedExams
            ? "Continue your preparation below."
            : "Your learning journey begins here. Pick your first exam to get started."}
        </p>
      </div>

      {/* Quick Stats (if has unlocked exams) */}
      {hasUnlockedExams && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card flex items-center gap-4">
            <div className="w-10 h-10 bg-secondary/10 rounded-card flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-light">
                {unlockedExamIds.size}
              </p>
              <p className="text-xs text-gray-500">Exams Unlocked</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-10 h-10 bg-warning/10 rounded-card flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-light">0</p>
              <p className="text-xs text-gray-500">Mocks Taken</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-10 h-10 bg-success/10 rounded-card flex items-center justify-center">
              <Trophy className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-light">--</p>
              <p className="text-xs text-gray-500">Best Score</p>
            </div>
          </div>
        </div>
      )}

      {/* Exam Cards */}
      <h2 className="text-lg font-semibold text-text-light mb-4">
        {hasUnlockedExams ? "Your Exams" : "Available Exams"}
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="card animate-pulse h-48 bg-gray-100"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EXAM_SLUGS.map((slug) => {
            const exam = EXAMS[slug];
            // Check if this exam is unlocked by matching slug against access data
            const isUnlocked = accessData?.some(
              (a: any) => a.exams?.slug === slug
            );

            return (
              <div
                key={slug}
                className={`card relative overflow-hidden transition-all hover:shadow-md ${
                  isUnlocked ? "border-2 border-success/30" : ""
                }`}
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-primary">
                    {exam.name}
                  </h3>
                  {isUnlocked ? (
                    <span className="text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-pill">
                      Unlocked
                    </span>
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                <p className="text-sm text-gray-500 mb-1">
                  {exam.mockQuestionCount} questions &middot;{" "}
                  {exam.mockDurationMinutes} min
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {exam.subjects.length} subjects
                </p>

                {isUnlocked ? (
                  <Link
                    href={`/exams/${slug}/subjects`}
                    className="btn-primary w-full text-sm flex items-center justify-center gap-2"
                  >
                    Start Preparing <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    href={`/pay/${slug}`}
                    className="btn-secondary w-full text-sm flex items-center justify-center gap-2"
                  >
                    Unlock for {exam.priceFormatted}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State — per Document 03 */}
      {!isLoading && !hasUnlockedExams && (
        <div className="mt-8 text-center py-8 px-4 border border-dashed border-gray-200 rounded-card">
          <p className="text-gray-500 text-sm">
            Your learning journey begins here. Pick your first exam to get started.
          </p>
        </div>
      )}
    </div>
  );
}
