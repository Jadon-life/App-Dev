"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { EXAMS } from "@shared/constants/exams";
import { Filter, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import type { ExamSlug, OptionLabel } from "@/types/database";

interface HistoryQuestion {
  id: string;
  question_text: string;
  options: { label: OptionLabel; text: string }[];
  correct_option: OptionLabel;
  explanation: string;
  subject: string;
  year: number;
}

export default function HistoryPage() {
  const params = useParams();
  const examSlug = params.exam as ExamSlug;
  const exam = EXAMS[examSlug];

  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});

  const { data: questions, isLoading } = useQuery({
    queryKey: ["history-questions", examSlug, selectedSubject, selectedYear],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any)
        .from("questions")
        .select("*")
        .eq("exam_id", examSlug)
        .order("year", { ascending: false })
        .order("subject", { ascending: true });

      if (selectedSubject) {
        query = query.eq("subject", selectedSubject);
      }
      if (selectedYear) {
        query = query.eq("year", parseInt(selectedYear));
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data as HistoryQuestion[];
    },
  });

  if (!exam) {
    return <div className="text-center py-12 text-gray-500">Exam not found.</div>;
  }

  // Available years for filter
  const years = Array.from({ length: 11 }, (_, i) => 2023 - i);

  const toggleAnswer = (qId: string) => {
    setShowAnswer((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            {exam.name} Past Questions
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Browse questions by subject and year
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <BookOpen className="w-4 h-4" />
          {questions?.length || 0} questions
        </div>
      </div>

      {/* Filters — per Doc 01: filterable by subject and year */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium text-text-light">Filters</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input-field w-auto min-w-[180px] text-sm"
          >
            <option value="">All Subjects</option>
            {exam.subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="input-field w-auto min-w-[120px] text-sm"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y.toString()}>
                {y}
              </option>
            ))}
          </select>

          {(selectedSubject || selectedYear) && (
            <button
              onClick={() => {
                setSelectedSubject("");
                setSelectedYear("");
              }}
              className="text-sm text-secondary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card animate-pulse h-20 bg-gray-50" />
          ))}
        </div>
      ) : questions && questions.length > 0 ? (
        <div className="space-y-3">
          {questions.map((q, index) => (
            <div key={q.id} className="card">
              <button
                onClick={() =>
                  setExpandedQuestion(
                    expandedQuestion === q.id ? null : q.id
                  )
                }
                className="w-full text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-text-light">
                      {index + 1}. {q.question_text}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-pill">
                        {q.subject}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-pill">
                        {q.year}
                      </span>
                    </div>
                  </div>
                  {expandedQuestion === q.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </button>

              {expandedQuestion === q.id && (
                <div className="mt-4 space-y-2">
                  {q.options.map((opt) => (
                    <div
                      key={opt.label}
                      className={`text-sm px-3 py-2 rounded-btn ${
                        showAnswer[q.id] && q.correct_option === opt.label
                          ? "bg-success/10 text-success font-medium"
                          : "text-gray-600 bg-gray-50"
                      }`}
                    >
                      <span className="font-mono mr-2">{opt.label}.</span>
                      {opt.text}
                      {showAnswer[q.id] && q.correct_option === opt.label && " ✓"}
                    </div>
                  ))}

                  {!showAnswer[q.id] ? (
                    <button
                      onClick={() => toggleAnswer(q.id)}
                      className="text-sm text-secondary hover:underline mt-2"
                    >
                      Show Answer
                    </button>
                  ) : (
                    q.explanation && (
                      <div className="mt-3 p-3 bg-correct/5 border border-correct/20 rounded-btn">
                        <p className="text-xs font-semibold text-correct mb-1">
                          Explanation:
                        </p>
                        <p className="text-sm text-gray-700">{q.explanation}</p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 text-sm">
          No questions found for the selected filters.
        </div>
      )}
    </div>
  );
}
