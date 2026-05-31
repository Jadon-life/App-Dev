"use client";

import Link from "next/link";
import { EXAMS, EXAM_SLUGS } from "@shared/constants/exams";
import { BookOpen, ArrowRight } from "lucide-react";

export default function ExamsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-text-primary dark:text-text-dark-primary">My Exams</h1>
        <p className="text-text-muted dark:text-text-dark-muted text-sm mt-1">
          Choose an exam to start preparing
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {EXAM_SLUGS.map((slug) => {
          const exam = EXAMS[slug];

          return (
            <div key={slug} className="dash-card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-heading font-bold text-xl text-text-primary dark:text-text-dark-primary">
                  {exam.name}
                </h2>
                <BookOpen className="w-4 h-4 text-text-muted dark:text-text-dark-muted" />
              </div>

              <p className="text-sm text-text-muted dark:text-text-dark-muted mb-4">{exam.fullName}</p>

              <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-text-muted dark:text-text-dark-muted">
                <span>{exam.subjects.length} subjects</span>
                <span>{exam.mockQuestionCount} questions per mock</span>
                <span>{exam.mockDurationMinutes} min timer</span>
                <span>10+ years of past questions</span>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/exams/${slug}/subjects`}
                  className="btn-primary flex-1 text-sm flex items-center justify-center gap-2"
                >
                  Start Mock
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/exams/${slug}/history`}
                  className="btn-secondary flex-1 text-sm flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Past Questions
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
