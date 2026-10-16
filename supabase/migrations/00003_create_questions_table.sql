-- CrysLearn Migration 003: Questions table
-- Source: Document 05 — Backend Schema
-- Past questions bank: JAMB, WAEC, NECO, Post-UTME going back 10+ years

CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 2000 AND year <= 2030),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,  -- Array of {label: "A"|"B"|"C"|"D", text: string}
  correct_option TEXT NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  explanation TEXT NOT NULL DEFAULT ''
);

-- Indexes for filtering: by exam, subject, year (per PRD: filterable by subject and year)
CREATE INDEX idx_questions_exam_id ON public.questions(exam_id);
CREATE INDEX idx_questions_subject ON public.questions(subject);
CREATE INDEX idx_questions_year ON public.questions(year);
CREATE INDEX idx_questions_exam_subject_year ON public.questions(exam_id, subject, year);

-- Enable RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- The access policy is created in migration 004, after user_exam_access exists.
-- Creating it here made a clean database fail before the referenced table existed.

-- Note: INSERT/UPDATE/DELETE only via service role (admin seeding questions)
