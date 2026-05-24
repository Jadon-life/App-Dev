// CrysLearn Shared Types — Used by both /web and /mobile
// Source of truth: Document 05 Backend Schema

export type UserRole = "student" | "parent";
export type ExamSlug = "jamb" | "waec" | "neco" | "post-utme";
export type OptionLabel = "A" | "B" | "C" | "D";

export interface QuestionOption {
  label: OptionLabel;
  text: string;
}

// ─── Database Row Types ─────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  linked_student_id: string | null;
}

export interface Exam {
  id: string;
  slug: ExamSlug;
  name: string;
  price_kobo: number;
  is_active: boolean;
}

export interface Question {
  id: string;
  exam_id: string;
  subject: string;
  year: number;
  question_text: string;
  options: QuestionOption[];
  correct_option: OptionLabel;
  explanation: string;
}

export interface UserExamAccess {
  id: string;
  user_id: string;
  exam_id: string;
  payment_ref: string;
  unlocked_at: string;
}

export interface MockAttempt {
  id: string;
  user_id: string;
  exam_id: string;
  subjects: string[];
  answers: Record<string, OptionLabel>;
  score: number;
  started_at: string;
  completed_at: string | null;
}

// ─── API Response Types ─────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  per_page: number;
}

// ─── App State Types ────────────────────────────────────────────

export interface MockExamState {
  exam_id: string;
  subjects: string[];
  questions: Question[];
  current_question_index: number;
  answers: Record<string, OptionLabel>;
  time_remaining_seconds: number;
  started_at: string;
  is_submitted: boolean;
}

export interface ExamResult {
  attempt_id: string;
  total_score: number;
  total_questions: number;
  subject_scores: Record<string, { correct: number; total: number }>;
  questions_with_answers: (Question & {
    user_answer: OptionLabel | null;
    is_correct: boolean;
  })[];
}

// ─── Payment Types ──────────────────────────────────────────────

export interface PaymentInitPayload {
  exam_id: string;
  email: string;
  amount_kobo: number;
}

export interface PaymentVerification {
  reference: string;
  status: "success" | "failed" | "abandoned";
  exam_id: string;
  user_id: string;
}
