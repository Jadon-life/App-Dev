-- The former parent policy queried public.users from a policy on public.users,
-- causing recursive row security. It also treated a student UUID as consent:
-- anyone could set role='parent', link any UUID, and read that student's data.
-- A verified consent flow is required before cross-account reading is enabled.
-- Preserve existing link values for migration/review; they grant no access.

BEGIN;

DROP POLICY IF EXISTS "Parents can view linked student" ON public.users;
DROP POLICY IF EXISTS "Parents can view linked student exam access" ON public.user_exam_access;
DROP POLICY IF EXISTS "Parents can view linked student attempts" ON public.mock_attempts;

-- Profiles are created by the auth trigger. Self-service clients may edit their
-- display name and student/parent preference, but never IDs, email, or links.
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
REVOKE ALL ON TABLE public.users FROM anon;
REVOKE INSERT, DELETE, UPDATE ON TABLE public.users FROM authenticated;
REVOKE UPDATE (id, email, created_at, linked_student_id) ON TABLE public.users FROM authenticated;
GRANT SELECT ON TABLE public.users TO authenticated;
GRANT UPDATE (name, role) ON TABLE public.users TO authenticated;

COMMIT;
