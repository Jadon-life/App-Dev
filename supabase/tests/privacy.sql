-- Executed after ALL migrations against a throwaway database.
CREATE FUNCTION public.test_assert(condition BOOLEAN, message TEXT) RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  IF condition IS DISTINCT FROM true THEN RAISE EXCEPTION 'FAIL: %', message; END IF;
END;
$$;
CREATE FUNCTION public.test_expect_denied(query TEXT) RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE query;
  RAISE EXCEPTION 'Expected insufficient_privilege for: %', query;
EXCEPTION WHEN insufficient_privilege THEN NULL;
END;
$$;

INSERT INTO auth.users (id, email, raw_user_meta_data) VALUES
  ('10000000-0000-4000-8000-000000000001', 'student@example.test', '{"full_name":"Student"}'),
  ('10000000-0000-4000-8000-000000000002', 'parent@example.test', '{"full_name":"Parent"}'),
  ('10000000-0000-4000-8000-000000000003', 'outsider@example.test', '{"full_name":"Outsider"}');
-- Retain a legacy unconsented link to prove it grants no cross-account privileges.
UPDATE public.users SET role = 'parent', linked_student_id = '10000000-0000-4000-8000-000000000001'
WHERE id = '10000000-0000-4000-8000-000000000002';
INSERT INTO public.exams (id, slug, name, price_kobo) VALUES
  ('20000000-0000-4000-8000-000000000001', 'jamb', 'Test JAMB', 10000);
INSERT INTO public.questions (id, exam_id, subject, year, question_text, options, correct_option, explanation) VALUES
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'Mathematics', 2024, 'What is 1 + 1?', '[{"label":"A","text":"1"},{"label":"B","text":"2"}]', 'B', 'One plus one equals two.');
INSERT INTO public.user_exam_access (id, user_id, exam_id, payment_ref) VALUES
  ('40000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'local-test-reference');
INSERT INTO public.mock_attempts (id, user_id, exam_id, subjects, question_ids, score) VALUES
  ('50000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '["Mathematics"]', ARRAY['30000000-0000-4000-8000-000000000001'::UUID], 1);

SET ROLE authenticated;
SET request.jwt.claim.role = 'authenticated';
SET request.jwt.claim.sub = '10000000-0000-4000-8000-000000000001';
SELECT public.test_assert((SELECT COUNT(*) = 1 FROM public.users), 'student sees own profile without recursive RLS');
SELECT public.test_assert((SELECT COUNT(*) = 1 FROM public.user_exam_access), 'student reads own entitlement');
SELECT public.test_assert((SELECT COUNT(*) = 1 FROM public.mock_attempts), 'student reads own attempt');
UPDATE public.users SET name = 'Updated student' WHERE id = auth.uid();
SELECT public.test_assert((SELECT name = 'Updated student' FROM public.users WHERE id = auth.uid()), 'self display-name update succeeds');
UPDATE public.users SET role = 'parent' WHERE id = auth.uid();
SELECT public.test_assert((SELECT COUNT(*) = 1 FROM public.users), 'changing account preference grants no extra profile access');
SELECT public.test_assert(NOT has_column_privilege(current_user, 'public.users', 'linked_student_id', 'UPDATE'), 'link column privilege removed');
SELECT public.test_assert(NOT has_column_privilege(current_user, 'public.users', 'email', 'UPDATE'), 'email column privilege removed');
SELECT public.test_assert(NOT has_column_privilege(current_user, 'public.users', 'id', 'UPDATE'), 'profile identifier privilege removed');
SELECT public.test_expect_denied($q$ UPDATE public.users SET linked_student_id = '10000000-0000-4000-8000-000000000003' WHERE id = auth.uid() $q$);
SELECT public.test_expect_denied($q$ UPDATE public.users SET email = 'hijacked@example.test' WHERE id = auth.uid() $q$);
SELECT public.test_expect_denied($q$ INSERT INTO public.users (id, email, name, role) VALUES (auth.uid(), 'duplicate@example.test', 'Duplicate', 'parent') $q$);
SELECT public.test_expect_denied($q$ SELECT correct_option FROM public.questions $q$);
SELECT public.test_expect_denied($q$ SELECT explanation FROM public.questions $q$);
SELECT public.test_expect_denied($q$ SELECT * FROM public.questions $q$);
SELECT public.test_assert((SELECT COUNT(question_text) = 1 FROM public.questions), 'authenticated safe question fields remain readable');
SELECT public.test_expect_denied($q$ INSERT INTO public.mock_attempts (user_id, exam_id, score) VALUES (auth.uid(), '20000000-0000-4000-8000-000000000001', 999) $q$);
SELECT public.test_expect_denied($q$ UPDATE public.mock_attempts SET score = 999 WHERE user_id = auth.uid() $q$);
SELECT public.test_expect_denied($q$ DELETE FROM public.mock_attempts WHERE user_id = auth.uid() $q$);
SELECT public.test_expect_denied($q$ SELECT * FROM public.exam_question_years('20000000-0000-4000-8000-000000000001') $q$);

SET request.jwt.claim.sub = '10000000-0000-4000-8000-000000000002';
SELECT public.test_assert((SELECT COUNT(*) = 1 FROM public.users), 'parent sees own profile only');
SELECT public.test_assert((SELECT COUNT(*) = 0 FROM public.users WHERE id = '10000000-0000-4000-8000-000000000001'), 'legacy parent link does not disclose student profile');
SELECT public.test_assert((SELECT COUNT(*) = 0 FROM public.user_exam_access), 'legacy parent link does not disclose student entitlement');
SELECT public.test_assert((SELECT COUNT(*) = 0 FROM public.mock_attempts), 'legacy parent link does not disclose student attempts');
UPDATE public.users SET name = 'Tampered' WHERE id = '10000000-0000-4000-8000-000000000001';
SELECT public.test_expect_denied($q$ UPDATE public.users SET linked_student_id = '10000000-0000-4000-8000-000000000003' WHERE id = auth.uid() $q$);

SET ROLE anon;
SET request.jwt.claim.role = 'anon';
SET request.jwt.claim.sub = '';
SELECT public.test_expect_denied($q$ SELECT * FROM public.users $q$);
SELECT public.test_expect_denied($q$ SELECT question_text FROM public.questions $q$);
SELECT public.test_assert((SELECT COUNT(*) = 1 FROM public.exams), 'anonymous exam catalog remains public');
SELECT public.test_assert((SELECT COUNT(*) = 0 FROM public.mock_attempts), 'anonymous user cannot read attempts');

SET ROLE service_role;
SET request.jwt.claim.role = 'service_role';
SELECT public.test_assert((SELECT COUNT(*) = 3 FROM public.users), 'service role can read profiles');
SELECT public.test_assert((SELECT name = 'Updated student' FROM public.users WHERE id = '10000000-0000-4000-8000-000000000001'), 'parent cannot alter student profile');
SELECT public.test_assert((SELECT correct_option = 'B' FROM public.questions LIMIT 1), 'trusted grader can read answer keys');
SELECT public.test_assert((SELECT COUNT(*) = 1 FROM public.exam_question_years('20000000-0000-4000-8000-000000000001')), 'service metadata function is usable');
UPDATE public.mock_attempts SET score = 2 WHERE id = '50000000-0000-4000-8000-000000000001';
SELECT public.test_assert((SELECT score = 2 FROM public.mock_attempts WHERE id = '50000000-0000-4000-8000-000000000001'), 'trusted grader can persist score');
SELECT public.test_assert((SELECT question_ids = ARRAY['30000000-0000-4000-8000-000000000001'::UUID] FROM public.mock_attempts LIMIT 1), 'durable question order is preserved');
INSERT INTO public.mock_attempts (user_id, exam_id, question_ids, expires_at) VALUES
  ('10000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', ARRAY['30000000-0000-4000-8000-000000000001'::UUID], NOW() + interval '1 hour');
RESET ROLE;
