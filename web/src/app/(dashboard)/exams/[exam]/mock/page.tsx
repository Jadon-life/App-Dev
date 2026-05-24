"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { EXAMS } from "@shared/constants/exams";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  AlertTriangle,
} from "lucide-react";
import type { ExamSlug, OptionLabel } from "@/types/database";

interface QuestionData {
  id: string;
  question_text: string;
  options: { label: OptionLabel; text: string }[];
  subject: string;
  year: number;
}

function MockExamContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const examSlug = params.exam as ExamSlug;
  const exam = EXAMS[examSlug];

  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, OptionLabel>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const subjects: string[] = (() => {
    try {
      return JSON.parse(searchParams.get("subjects") || "[]");
    } catch {
      return [];
    }
  })();

  // Load questions
  useEffect(() => {
    async function loadQuestions() {
      if (!exam || subjects.length === 0) return;

      setLoading(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any)
        .from("questions")
        .select("id, question_text, options, subject, year")
        .eq("exam_id", examSlug);

      if (subjects.length > 0) {
        query = query.in("subject", subjects);
      }

      const { data, error } = await query
        .limit(exam.mockQuestionCount)
        .order("year", { ascending: false });

      if (error) {
        console.error("Failed to load questions:", error);
        setLoading(false);
        return;
      }

      // Shuffle questions
      const shuffled = (data || []).sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, exam.mockQuestionCount));
      setTimeRemaining(exam.mockDurationMinutes * 60);

      // Create mock attempt record
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: attempt } = await (supabase as any)
          .from("mock_attempts")
          .insert({
            user_id: user.id,
            exam_id: examSlug,
            subjects,
            answers: {},
            score: 0,
          })
          .select("id")
          .single();

        if (attempt) {
          setAttemptId(attempt.id);
        }
      }

      setLoading(false);
    }

    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0 || loading || submitting) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit(); // Auto-submit on timeout (per Doc 01)
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, submitting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswer = (questionId: string, option: OptionLabel) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    // Navigate to results with answers
    const answersParam = encodeURIComponent(JSON.stringify(answers));
    const questionsParam = encodeURIComponent(
      JSON.stringify(questions.map((q) => q.id))
    );

    router.push(
      `/exams/${examSlug}/results?attempt=${attemptId}&answers=${answersParam}&questions=${questionsParam}`
    );
  }, [submitting, answers, questions, examSlug, attemptId, router]);

  if (!exam || subjects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Invalid exam configuration.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          No questions available for the selected subjects.
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isUrgent = timeRemaining < 300; // Under 5 minutes (per Doc 04)
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-3xl mx-auto -mt-8">
      {/* Timer — per Doc 04: sticky top bar, red pulse under 5 min */}
      <div
        className={`exam-timer ${isUrgent ? "urgent" : ""} -mx-4 sm:-mx-6 lg:-mx-8`}
      >
        <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
          <span className="text-sm text-gray-500">
            {answeredCount}/{questions.length} answered
          </span>
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${isUrgent ? "text-danger" : ""}`} />
            <span
              className={`font-mono font-bold ${
                isUrgent ? "text-danger" : "text-text-light"
              }`}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="flex items-center gap-1 text-sm font-medium text-secondary hover:text-primary"
          >
            <Flag className="w-4 h-4" />
            Submit
          </button>
        </div>
      </div>

      {/* Question */}
      <div className="card mt-6">
        {/* Question header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-pill">
            {currentQuestion.subject} &middot; {currentQuestion.year}
          </span>
          <span className="font-mono text-sm text-gray-500">
            Q{currentIndex + 1}/{questions.length}
          </span>
        </div>

        {/* Question text */}
        <p className="text-lg font-medium text-text-light leading-relaxed mb-6">
          {currentQuestion.question_text}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = answers[currentQuestion.id] === option.label;
            return (
              <button
                key={option.label}
                onClick={() => handleAnswer(currentQuestion.id, option.label)}
                className={`w-full text-left px-4 py-3 rounded-btn border-2 transition-all min-h-touch ${
                  isSelected
                    ? "border-secondary bg-secondary/5 text-secondary"
                    : "border-gray-200 text-text-light hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      isSelected
                        ? "border-secondary bg-secondary text-white"
                        : "border-gray-300 text-gray-500"
                    }`}
                  >
                    {option.label}
                  </span>
                  <span className="text-sm">{option.text}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="btn-secondary flex items-center gap-1 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {/* Question indicators */}
        <div className="hidden sm:flex gap-1 flex-wrap max-w-md justify-center">
          {questions.slice(0, 20).map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-7 h-7 rounded text-xs font-medium ${
                i === currentIndex
                  ? "bg-secondary text-white"
                  : answers[q.id]
                  ? "bg-success/20 text-success border border-success/30"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {i + 1}
            </button>
          ))}
          {questions.length > 20 && (
            <span className="text-xs text-gray-400 self-center">...</span>
          )}
        </div>

        <button
          onClick={() =>
            setCurrentIndex((prev) =>
              Math.min(questions.length - 1, prev + 1)
            )
          }
          disabled={currentIndex === questions.length - 1}
          className="btn-secondary flex items-center gap-1 disabled:opacity-30"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="card max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-warning" />
              <h3 className="font-semibold text-lg text-text-light">
                Submit Exam?
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              You have answered {answeredCount} out of {questions.length}{" "}
              questions.
            </p>
            {answeredCount < questions.length && (
              <p className="text-sm text-warning mb-4">
                {questions.length - answeredCount} question(s) are unanswered.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="btn-secondary flex-1"
              >
                Continue Exam
              </button>
              <button onClick={handleSubmit} className="btn-primary flex-1">
                {submitting ? "Submitting..." : "Submit Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MockExamPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <MockExamContent />
    </Suspense>
  );
}
