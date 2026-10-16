-- Repair historical databases missing their authenticated read policies.
-- Table/column grants from 00008/00009 continue to prohibit client writes and
-- answer-key access. No parent or cross-account access is added.
BEGIN;

ALTER TABLE public.mock_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own mock attempts" ON public.mock_attempts;
CREATE POLICY "Users can view own mock attempts"
  ON public.mock_attempts FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

ALTER TABLE public.user_exam_access ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own exam access" ON public.user_exam_access;
CREATE POLICY "Users can view own exam access"
  ON public.user_exam_access FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can view questions" ON public.questions;
CREATE POLICY "Authenticated users can view questions"
  ON public.questions FOR SELECT TO authenticated
  USING (true);

COMMIT;
