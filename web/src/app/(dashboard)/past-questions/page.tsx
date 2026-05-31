"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { EXAMS, EXAM_SLUGS } from "@shared/constants/exams";
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

export default function PastQuestionsPage() {
  const [selectedExam, setSelectedExam] = useState<ExamSlug>(EXAM_SLUGS[0]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});

  const exam = EXAMS[selectedExam];

  const { data: questions, isLoading } = useQuery({
    queryKey: ["past-questions", selectedExam, selectedSubject, selectedYear],
    queryFn: async () => {
      // Resolve the exam slug to its UUID
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: examRecord, error: examError } = await (supabase as any)
        .from("exams")
        .select("id")
        .eq("slug", selectedExam)
        .single();

      if (examError || !examRecord) throw examError || new Error("Exam not found");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any)
        .from("questions")
        .select("*")
        .eq("exam_id", examRecord.id)
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
      return (data || []).map((q: any) => ({
        ...q,
        options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
      })) as HistoryQuestion[];
    },
  });

  // Available years for filter
  const years = Array.from({ length: 11 }, (_, i) => 2025 - i);

  const toggleAnswer = (qId: string) => {
    setShowAnswer((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text-primary dark:text-text-dark-primary">
            Past Questions
          </h1>
          <p className="text-text-muted dark:text-text-dark-muted text-sm mt-1">
            Browse questions by exam, subject, and year
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-text-dark-muted">
          <BookOpen className="w-4 h-4" />
          {questions?.length || 0} questions
        </div>
      </div>

      {/* Filters */}
      <div className="dash-card mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-brand-surf" />
          <span className="text-sm font-medium text-text-primary dark:text-text-dark-primary">Filters</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Exam selector */}
          <select
            value={selectedExam}
            onChange={(e) => {
              setSelectedExam(e.target.value as ExamSlug);
              setSelectedSubject("");
            }}
            className="input-field w-auto min-w-[160px] text-sm"
          >
            {EXAM_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {EXAMS[slug].name}
              </option>
            ))}
          </select>

          {/* Subject selector */}
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

          {/* Year selector */}
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
              className="text-sm text-brand-surf hover:underline"
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
            <div key={i} className="dash-card animate-pulse h-20" />
          ))}
        </div>
      ) : questions && questions.length > 0 ? (
        <div className="space-y-3">
          {questions.map((q, index) => (
            <div key={q.id} className="dash-card">
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
                    <p className="text-sm font-medium text-text-primary dark:text-text-dark-primary">
                      {index + 1}. {q.question_text}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-brand-surf/10 text-brand-surf px-2 py-0.5 rounded-pill">
                        {q.subject}
                      </span>
                      <span className="text-xs bg-brand-surf/10 text-brand-surf px-2 py-0.5 rounded-pill">
                        {q.year}
                      </span>
                    </div>
                  </div>
                  {expandedQuestion === q.id ? (
                    <ChevronUp className="w-4 h-4 text-text-muted dark:text-text-dark-muted flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-text-muted dark:text-text-dark-muted flex-shrink-0" />
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
                          ? "bg-green-500/10 text-green-600 dark:text-green-400 font-medium"
                          : "text-text-muted dark:text-text-dark-muted bg-brand-teal/[0.03] dark:bg-brand-frost/[0.03]"
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
                      className="text-sm text-brand-surf hover:underline mt-2"
                    >
                      Show Answer
                    </button>
                  ) : (
                    q.explanation && (
                      <div className="mt-3 p-3 bg-brand-surf/5 border border-brand-surf/20 rounded-btn">
                        <p className="text-xs font-semibold text-brand-surf mb-1">
                          Explanation:
                        </p>
                        <p className="text-sm text-text-primary dark:text-text-dark-primary">{q.explanation}</p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-text-muted dark:text-text-dark-muted text-sm">
          No questions found for the selected filters.
        </div>
      )}
    </div>
  );
}
