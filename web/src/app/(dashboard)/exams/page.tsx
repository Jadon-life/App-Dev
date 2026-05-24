"use client";

import Link from "next/link";
import { useExamAccess } from "@/hooks/useProfile";
import { EXAMS, EXAM_SLUGS } from "@shared/constants/exams";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ExamsPage() {
  const { data: accessData, isLoading } = useExamAccess();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">All Exams</h1>
        <p className="text-gray-500 text-sm mt-1">
          Choose an exam to start preparing or unlock new ones
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse h-48 bg-gray-50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {EXAM_SLUGS.map((slug) => {
            const exam = EXAMS[slug];
            const isUnlocked = accessData?.some(
              (a: any) => a.exams?.slug === slug
            );

            return (
              <div
                key={slug}
                className={`card ${
                  isUnlocked ? "border-2 border-success/30" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-primary">
                    {exam.name}
                  </h2>
                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-pill">
                      <CheckCircle2 className="w-3 h-3" />
                      Unlocked
                    </span>
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                <p className="text-sm text-gray-500 mb-4">{exam.fullName}</p>

                <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-500">
                  <span>{exam.subjects.length} subjects</span>
                  <span>{exam.mockQuestionCount} questions per mock</span>
                  <span>{exam.mockDurationMinutes} min timer</span>
                  <span>10+ years of past questions</span>
                </div>

                {isUnlocked ? (
                  <div className="flex gap-2">
                    <Link
                      href={`/exams/${slug}/subjects`}
                      className="btn-primary text-sm flex-1 flex items-center justify-center gap-2"
                    >
                      Take Mock <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/exams/${slug}/history`}
                      className="btn-secondary text-sm flex-1 text-center"
                    >
                      Past Questions
                    </Link>
                  </div>
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
    </div>
  );
}
