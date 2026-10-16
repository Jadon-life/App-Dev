-- Some existing projects lack the original self-profile policies. A table grant
-- alone cannot authorize rows under RLS. Restore only account-owner access.
BEGIN;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Migration 00008 retains column-level grants for name/role only. This does not
-- permit profile insertion, identifier changes, or cross-account student links.
COMMIT;
