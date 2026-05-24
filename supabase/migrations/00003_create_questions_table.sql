-- PrepHQ Migration 003: Questions table
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

-- RLS: Authenticated users with exam access can read questions
-- (Access is checked via user_exam_access table)
CREATE POLICY "Users with exam access can view questions"
  ON public.questions
  FOR SELECT
  USING (
    exam_id IN (
      SELECT exam_id FROM public.user_exam_access WHERE user_id = auth.uid()
    )
  );

-- Note: INSERT/UPDATE/DELETE only via service role (admin seeding questions)
