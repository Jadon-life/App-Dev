"use client";

import { useExamAccess } from "@/hooks/useProfile";
import { EXAMS } from "@shared/constants/exams";
import { Download, HardDrive, WifiOff } from "lucide-react";
import type { ExamSlug } from "@/types/database";

export default function OfflinePage() {
  const { data: accessData, isLoading } = useExamAccess();

  const unlockedExams =
    accessData
      ?.map((a: any) => a.exams?.slug as ExamSlug)
      .filter(Boolean) || [];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Offline Downloads</h1>
        <p className="text-gray-500 text-sm mt-1">
          Download question packs to study without internet
        </p>
      </div>

      {/* Info Banner */}
      <div className="card mb-6 bg-secondary/5 border-secondary/20">
        <div className="flex items-start gap-3">
          <WifiOff className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-text-light">
              Offline mode is available on the mobile app
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Download question packs on your phone for study without internet.
              The web version requires an internet connection.
            </p>
          </div>
        </div>
      </div>

      {/* Available Packs */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse h-32 bg-gray-50" />
          ))}
        </div>
      ) : unlockedExams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {unlockedExams.map((slug) => {
            const exam = EXAMS[slug];
            if (!exam) return null;
            return (
              <div key={slug} className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-text-light">{exam.name}</h3>
                  <span className="text-xs text-gray-400">
                    ~{Math.round(exam.subjects.length * 50 * 0.5)} KB
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  {exam.subjects.length} subjects &middot; All years
                </p>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    Available on mobile app
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State — per Document 03 */
        <div className="text-center py-12 border border-dashed border-gray-200 rounded-card">
          <Download className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            Download question packs to study without internet.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Unlock an exam first to download its question pack.
          </p>
        </div>
      )}
    </div>
  );
}
