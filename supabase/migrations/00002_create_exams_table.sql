-- CrysLearn Migration 002: Exams table
-- Source: Document 05 — Backend Schema
-- Stores available exam types (JAMB, WAEC, NECO, Post-UTME)

CREATE TABLE public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL CHECK (slug IN ('jamb', 'waec', 'neco', 'post-utme')),
  name TEXT NOT NULL,
  price_kobo INTEGER NOT NULL CHECK (price_kobo > 0),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Index for quick slug lookup
CREATE INDEX idx_exams_slug ON public.exams(slug);

-- Enable RLS
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- RLS: Everyone can read active exams (public data)
CREATE POLICY "Anyone can view active exams"
  ON public.exams
  FOR SELECT
  USING (is_active = true);

-- RLS: Only admin (service role) can insert/update/delete exams
-- (No policies for INSERT/UPDATE/DELETE — only service role can modify)
