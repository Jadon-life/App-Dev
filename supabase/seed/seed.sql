-- PrepHQ Complete Seed File
-- Run this file to seed all development data
-- Usage: psql -f seed.sql or via Supabase Dashboard SQL Editor

-- 1. Seed exams
\i 001_exams.sql

-- 2. Seed questions
\i 002_questions_jamb.sql
\i 003_questions_waec.sql
\i 004_questions_neco.sql
\i 005_questions_post_utme.sql

-- Confirm seed counts
SELECT 'Exams seeded:' AS status, COUNT(*) FROM public.exams;
SELECT 'Questions seeded:' AS status, COUNT(*) FROM public.questions;
SELECT 'JAMB questions:' AS status, COUNT(*) FROM public.questions WHERE exam_id = '11111111-1111-1111-1111-111111111111';
SELECT 'WAEC questions:' AS status, COUNT(*) FROM public.questions WHERE exam_id = '22222222-2222-2222-2222-222222222222';
SELECT 'NECO questions:' AS status, COUNT(*) FROM public.questions WHERE exam_id = '33333333-3333-3333-3333-333333333333';
SELECT 'Post-UTME questions:' AS status, COUNT(*) FROM public.questions WHERE exam_id = '44444444-4444-4444-4444-444444444444';
