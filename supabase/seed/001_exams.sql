-- CrysLearn Seed Data: Exams
-- Source: Document 05 + Document 01 (pricing from PRD: ₦3,500–₦5,000 ARPU)

INSERT INTO public.exams (id, slug, name, price_kobo, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'jamb', 'JAMB (UTME)', 350000, true),
  ('22222222-2222-2222-2222-222222222222', 'waec', 'WAEC (SSCE)', 350000, true),
  ('33333333-3333-3333-3333-333333333333', 'neco', 'NECO (SSCE)', 350000, true),
  ('44444444-4444-4444-4444-444444444444', 'post-utme', 'Post-UTME', 500000, true);
