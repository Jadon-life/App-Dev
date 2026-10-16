-- Restrict paid question-bank access at the database boundary.
-- Migration 00007 exposed correct answers to every authenticated account.
DROP POLICY IF EXISTS "Authenticated users can view questions" ON public.questions;
DROP POLICY IF EXISTS "Users with exam access can view questions" ON public.questions;

CREATE POLICY "Paid users can view their exam questions"
  ON public.questions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_exam_access access
      WHERE access.exam_id = questions.exam_id
        AND access.user_id = (SELECT auth.uid())
    )
  );

-- Prevent a user from promoting themselves to a parent or linking another
-- student simply by updating their own profile via the public client.
-- Trusted account-type/linking workflows must use a server-authorized action.
CREATE OR REPLACE FUNCTION public.protect_user_relationships()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF auth.role() <> 'service_role' AND (
    NEW.role IS DISTINCT FROM OLD.role
    OR NEW.linked_student_id IS DISTINCT FROM OLD.linked_student_id
    OR NEW.email IS DISTINCT FROM OLD.email
  ) THEN
    RAISE EXCEPTION 'Account role, email and student links require verified changes';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_user_relationships ON public.users;
CREATE TRIGGER protect_user_relationships
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.protect_user_relationships();
