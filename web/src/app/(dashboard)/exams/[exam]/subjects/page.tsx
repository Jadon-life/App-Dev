"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { EXAMS } from "@shared/constants/exams";
import { CheckCircle2, Clock, BookOpen, ArrowRight } from "lucide-react";
import type { ExamSlug } from "@/types/database";

export default function SubjectsPage() {
  const params = useParams();
  const router = useRouter();
  const examSlug = params.exam as ExamSlug;
  const exam = EXAMS[examSlug];

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  if (!exam) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Exam not found.</p>
      </div>
    );
  }

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const selectAll = () => {
    setSelectedSubjects(exam.subjects);
  };

  const startMock = () => {
    if (selectedSubjects.length === 0) return;
    const subjectsParam = encodeURIComponent(JSON.stringify(selectedSubjects));
    router.push(`/exams/${examSlug}/mock?subjects=${subjectsParam}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">{exam.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{exam.fullName}</p>
        </div>
        <Link
          href={`/exams/${examSlug}/history`}
          className="btn-secondary text-sm flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Past Questions
        </Link>
      </div>

      {/* Mock Exam Setup */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-secondary" />
          <div>
            <h2 className="font-semibold text-text-light">Take Mock Exam</h2>
            <p className="text-sm text-gray-500">
              {exam.mockQuestionCount} questions &middot;{" "}
              {exam.mockDurationMinutes} minutes &middot; Auto-submit on timeout
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Select the subjects you want to include in your mock exam:
        </p>

        {/* Select All */}
        <button
          onClick={selectAll}
          className="text-sm text-secondary hover:underline mb-3"
        >
          Select all ({exam.subjects.length} subjects)
        </button>

        {/* Subject Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-6">
          {exam.subjects.map((subject) => {
            const selected = selectedSubjects.includes(subject);
            return (
              <button
                key={subject}
                onClick={() => toggleSubject(subject)}
                className={`px-3 py-2.5 rounded-btn text-sm font-medium text-left transition-all border ${
                  selected
                    ? "border-secondary bg-secondary/10 text-secondary"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  {selected && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                  {subject}
                </span>
              </button>
            );
          })}
        </div>

        {/* Start Button */}
        <button
          onClick={startMock}
          disabled={selectedSubjects.length === 0}
          className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Mock Exam
          <ArrowRight className="w-4 h-4" />
        </button>
        {selectedSubjects.length > 0 && (
          <p className="text-xs text-gray-400 mt-2">
            {selectedSubjects.length} subject(s) selected
          </p>
        )}
      </div>
    </div>
  );
}
