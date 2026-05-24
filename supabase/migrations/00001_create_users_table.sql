-- CrysLearn Migration 001: Users table
-- Source: Document 05 — Backend Schema
-- Users are created via Supabase Auth, this extends the auth.users table

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'parent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  linked_student_id UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Index for parent → student lookup
CREATE INDEX idx_users_linked_student ON public.users(linked_student_id) WHERE linked_student_id IS NOT NULL;
CREATE INDEX idx_users_role ON public.users(role);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only read/write their own rows
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Parents can view their linked student's profile
CREATE POLICY "Parents can view linked student"
  ON public.users
  FOR SELECT
  USING (
    id IN (
      SELECT linked_student_id FROM public.users WHERE id = auth.uid() AND role = 'parent'
    )
  );

-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger: auto-create profile when user signs up via Supabase Auth
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
