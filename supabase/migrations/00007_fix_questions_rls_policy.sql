-- CrysLearn Migration 007: Fix questions RLS policy
-- Allow authenticated users to read questions without requiring user_exam_access
-- This enables the app to display questions for mock exams and past question browsing
-- Payment gating is handled at the application/UI level

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users with exam access can view questions" ON public.questions;

-- New policy: All authenticated users can view questions
CREATE POLICY "Authenticated users can view questions"
  ON public.questions
  FOR SELECT
  USING (auth.role() = 'authenticated');
