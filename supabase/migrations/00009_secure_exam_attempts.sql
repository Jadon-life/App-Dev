-- Durable exam composition and server-owned grading. Apply before using the new exam API.
-- Existing attempts retain their historical score; they have no reconstructable question list.
ALTER TABLE public.mock_attempts
  ADD COLUMN IF NOT EXISTS question_ids UUID[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS review_snapshot JSONB,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS answer_revision INTEGER NOT NULL DEFAULT 0 CHECK (answer_revision >= 0);

-- Browsers can read their own attempts through the existing SELECT RLS policies.
-- All creation/autosave/completion is authenticated and validated by the server API.
REVOKE INSERT, UPDATE, DELETE ON public.mock_attempts FROM anon, authenticated;
GRANT SELECT ON public.mock_attempts TO authenticated;
GRANT ALL ON public.mock_attempts TO service_role;

-- Remove broad answer-key access through the database REST API. The authenticated
-- practice API intentionally returns explanations; timed exam payloads omit them.
REVOKE SELECT ON public.questions FROM anon, authenticated;
GRANT SELECT (id, exam_id, subject, year, question_text, options) ON public.questions TO authenticated;
GRANT ALL ON public.questions TO service_role;

-- A bounded metadata query avoids downloading the entire bank to build year filters.
CREATE OR REPLACE FUNCTION public.exam_question_years(p_exam_id UUID)
RETURNS TABLE(year INTEGER)
LANGUAGE SQL STABLE SET search_path = ''
AS $$ SELECT DISTINCT q.year FROM public.questions q WHERE q.exam_id = p_exam_id ORDER BY q.year DESC $$;
REVOKE ALL ON FUNCTION public.exam_question_years(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.exam_question_years(UUID) TO service_role;
