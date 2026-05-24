-- PrepHQ Migration 005: Mock Attempts table
-- Source: Document 05 — Backend Schema
-- Records every mock exam attempt, scores, and answers

CREATE TABLE public.mock_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  subjects JSONB NOT NULL DEFAULT '[]',  -- Array of subject strings selected for this mock
  answers JSONB NOT NULL DEFAULT '{}',   -- Map of question_id → chosen option (A/B/C/D)
  score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ  -- Null if abandoned
);

-- Indexes for dashboard queries and performance tracking
CREATE INDEX idx_mock_attempts_user ON public.mock_attempts(user_id);
CREATE INDEX idx_mock_attempts_exam ON public.mock_attempts(exam_id);
CREATE INDEX idx_mock_attempts_user_exam ON public.mock_attempts(user_id, exam_id);
CREATE INDEX idx_mock_attempts_completed ON public.mock_attempts(completed_at) WHERE completed_at IS NOT NULL;

-- Enable RLS
ALTER TABLE public.mock_attempts ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view their own attempts
CREATE POLICY "Users can view own mock attempts"
  ON public.mock_attempts
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS: Users can insert their own attempts
CREATE POLICY "Users can create own mock attempts"
  ON public.mock_attempts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS: Users can update their own attempts (submitting answers)
CREATE POLICY "Users can update own mock attempts"
  ON public.mock_attempts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Parents can view their linked student's mock attempts
CREATE POLICY "Parents can view linked student attempts"
  ON public.mock_attempts
  FOR SELECT
  USING (
    user_id IN (
      SELECT linked_student_id FROM public.users WHERE id = auth.uid() AND role = 'parent'
    )
  );
