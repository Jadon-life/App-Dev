-- CrysLearn Migration 004: User Exam Access table
-- Source: Document 05 — Backend Schema
-- Records which exams a user has paid for and unlocked

CREATE TABLE public.user_exam_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  payment_ref TEXT NOT NULL,  -- Paystack payment reference (no card data stored)
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate purchases
  UNIQUE(user_id, exam_id)
);

-- Indexes
CREATE INDEX idx_user_exam_access_user ON public.user_exam_access(user_id);
CREATE INDEX idx_user_exam_access_exam ON public.user_exam_access(exam_id);

-- Enable RLS
ALTER TABLE public.user_exam_access ENABLE ROW LEVEL SECURITY;

-- RLS: Users can only see their own access records
CREATE POLICY "Users can view own exam access"
  ON public.user_exam_access
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS: Only server (service role) can insert access (via payment webhook)
-- No INSERT policy for users — only the Paystack webhook handler inserts

-- Parents can view their linked student's exam access
CREATE POLICY "Parents can view linked student exam access"
  ON public.user_exam_access
  FOR SELECT
  USING (
    user_id IN (
      SELECT linked_student_id FROM public.users WHERE id = auth.uid() AND role = 'parent'
    )
  );
