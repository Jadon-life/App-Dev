"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { EXAMS } from "@shared/constants/exams";
import {
  Trophy,
  RotateCcw,
  Home,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { ExamSlug, OptionLabel } from "@/types/database";

interface QuestionWithAnswer {
  id: string;
  question_text: string;
  options: { label: OptionLabel; text: string }[];
  correct_option: OptionLabel;
  explanation: string;
  subject: string;
  year: number;
  user_answer: OptionLabel | null;
  is_correct: boolean;
}

function ResultsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const examSlug = params.exam as ExamSlug;
  const exam = EXAMS[examSlug];

  const [results, setResults] = useState<QuestionWithAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const attemptId = searchParams.get("attempt");
  const answersStr = searchParams.get("answers");
  const questionsStr = searchParams.get("questions");

  useEffect(() => {
    async function loadResults() {
      if (!answersStr || !questionsStr) {
        setLoading(false);
        return;
      }

      try {
        const userAnswers: Record<string, OptionLabel> = JSON.parse(
          decodeURIComponent(answersStr)
        );
        const questionIds: string[] = JSON.parse(
          decodeURIComponent(questionsStr)
        );

        // Fetch full questions with correct answers
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: questions, error } = await (supabase as any)
          .from("questions")
          .select("*")
          .in("id", questionIds);

        if (error) throw error;

        const questionsWithAnswers: QuestionWithAnswer[] = (questions || []).map(
          (q: any) => ({
            ...q,
            user_answer: userAnswers[q.id] || null,
            is_correct: userAnswers[q.id] === q.correct_option,
          })
        );

        setResults(questionsWithAnswers);

        // Calculate score and update attempt
        const correctCount = questionsWithAnswers.filter(
          (q) => q.is_correct
        ).length;
        const score = Math.round(
          (correctCount / questionsWithAnswers.length) * 100
        );

        // Update mock attempt in DB
        if (attemptId && user) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from("mock_attempts")
            .update({
              answers: userAnswers,
              score,
              completed_at: new Date().toISOString(),
            })
            .eq("id", attemptId);
        }
      } catch (err) {
        console.error("Failed to load results:", err);
      }

      setLoading(false);
    }

    loadResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No results available.</p>
        <Link href="/dashboard" className="btn-primary mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Calculate scores
  const totalQuestions = results.length;
  const correctCount = results.filter((q) => q.is_correct).length;
  const score = Math.round((correctCount / totalQuestions) * 100);

  // Subject breakdown
  const subjectScores: Record<string, { correct: number; total: number }> = {};
  results.forEach((q) => {
    if (!subjectScores[q.subject]) {
      subjectScores[q.subject] = { correct: 0, total: 0 };
    }
    subjectScores[q.subject].total++;
    if (q.is_correct) subjectScores[q.subject].correct++;
  });

  const scoreColor =
    score >= 70 ? "text-success" : score >= 50 ? "text-warning" : "text-danger";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Score Header */}
      <div className="card text-center mb-6">
        <Trophy
          className={`w-12 h-12 mx-auto mb-3 ${scoreColor}`}
        />
        <p className={`text-5xl font-bold ${scoreColor}`}>{score}%</p>
        <p className="text-gray-500 mt-2">
          {correctCount} out of {totalQuestions} correct
        </p>
        <p className="text-sm text-gray-400 mt-1">
          {exam?.name} Mock Exam
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center mt-6">
          <Link
            href={`/exams/${examSlug}/subjects`}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Take Another Mock
          </Link>
          <Link
            href="/dashboard"
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>

      {/* Subject Breakdown — per Doc 01: performance breakdown by subject */}
      <div className="card mb-6">
        <h2 className="font-semibold text-text-light mb-4">
          Performance by Subject
        </h2>
        <div className="space-y-3">
          {Object.entries(subjectScores).map(([subject, data]) => {
            const pct = Math.round((data.correct / data.total) * 100);
            const barColor =
              pct >= 70
                ? "bg-success"
                : pct >= 50
                ? "bg-warning"
                : "bg-danger";
            return (
              <div key={subject}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text-light">{subject}</span>
                  <span className="text-sm font-medium text-gray-500">
                    {data.correct}/{data.total} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question Review — per Doc 04: green/red borders + explanations */}
      <div className="space-y-3">
        <h2 className="font-semibold text-text-light">
          Question Review
        </h2>
        {results.map((q, index) => (
          <div
            key={q.id}
            className={q.is_correct ? "correct-answer" : "wrong-answer"}
          >
            <button
              onClick={() =>
                setExpandedQuestion(
                  expandedQuestion === q.id ? null : q.id
                )
              }
              className="w-full text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {q.is_correct ? (
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-text-light">
                      Q{index + 1}. {q.question_text}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {q.subject} &middot; {q.year}
                    </p>
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
              <div className="mt-4 ml-8 space-y-2">
                {q.options.map((opt) => {
                  const isUserAnswer = q.user_answer === opt.label;
                  const isCorrect = q.correct_option === opt.label;
                  return (
                    <div
                      key={opt.label}
                      className={`text-sm px-3 py-2 rounded-btn ${
                        isCorrect
                          ? "bg-success/10 text-success font-medium"
                          : isUserAnswer
                          ? "bg-danger/10 text-danger"
                          : "text-gray-600"
                      }`}
                    >
                      <span className="font-mono mr-2">{opt.label}.</span>
                      {opt.text}
                      {isCorrect && " ✓"}
                      {isUserAnswer && !isCorrect && " ✗ (your answer)"}
                    </div>
                  );
                })}

                {/* Explanation — per Doc 01: AI explanation for wrong answers */}
                {q.explanation && (
                  <div className="mt-3 p-3 bg-correct/5 border border-correct/20 rounded-btn">
                    <p className="text-xs font-semibold text-correct mb-1">
                      Explanation:
                    </p>
                    <p className="text-sm text-gray-700">{q.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
