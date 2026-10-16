# CrysLearn — Supabase Database

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy the Project URL and anon key to your `.env` files

### 2. Run Migrations

In the Supabase Dashboard SQL Editor, run each migration file in order:

1. `migrations/00001_create_users_table.sql`
2. `migrations/00002_create_exams_table.sql`
3. `migrations/00003_create_questions_table.sql`
4. `migrations/00004_create_user_exam_access_table.sql`
5. `migrations/00005_create_mock_attempts_table.sql`
6. `migrations/00006_create_storage_buckets.sql`
7. `migrations/00007_fix_questions_rls_policy.sql`
8. `migrations/00008_secure_profile_access.sql`
9. `migrations/00009_secure_exam_attempts.sql`
10. `migrations/00010_restore_own_profile_policies.sql`
11. `migrations/00011_restore_study_read_policies.sql`

For an existing database, apply only migrations that have not been applied yet.
The question-access policy now appears in migration 004, after its referenced
`user_exam_access` table exists. This fixes clean bootstrap; do not rerun historical
migrations against an existing database. Migrations 008 through 011 must be applied
before using the updated profile and exam workflows. Review them before applying
to production; the application does not apply database changes automatically.
Migration 010 restores owner-only profile access when historical self-profile
policies are missing. It is safe to rerun and retains the restricted column grants.
Migration 011 restores owner-only history/access reads and authenticated access to
safe question columns. It adds no client write permissions or answer-key grants.

### 3. Seed Data

Run each seed file in order:

1. `seed/001_exams.sql` — Creates JAMB, WAEC, NECO, Post-UTME
2. `seed/002_questions_jamb.sql` — 50 JAMB sample questions
3. `seed/003_questions_waec.sql` — 50 WAEC sample questions
4. `seed/004_questions_neco.sql` — 50 NECO sample questions
5. `seed/005_questions_post_utme.sql` — 50 Post-UTME sample questions

### 4. Configure Auth

1. Enable Email/Password auth in Supabase Dashboard
2. Enable Google OAuth provider
3. Add redirect URLs:
   - `http://localhost:3000/api/auth/callback` (web dev)
   - `cryslearn://auth/callback` (mobile)

### Database Schema

```
users → exams (via user_exam_access)
users → mock_attempts
questions → exams
user_exam_access → users, exams
mock_attempts → users, exams
users.linked_student_id → users (self-referential, parent→student)
```

### Storage Buckets

- `question-images` — Diagrams/charts for questions
- `avatars` — User profile photos

### RLS Summary

- All tables have Row Level Security enabled
- Users can read their own profile and edit only their name and account preference
- Student IDs do not constitute consent. Parent links grant no cross-account access
  until a secure student approval flow exists; existing link values are preserved
- Exams are publicly readable (active ones)
- Authenticated users can read question text and options. Direct answer-key and
  explanation column access is denied; server APIs enforce the paid exam workflow
- Mock attempts can be read by their owner; only the authenticated server workflow
  creates attempts, saves answers, and computes scores
- Exam access is inserted only by server (payment webhook)

### Test migrations and access rules locally

With Docker available, run `bash scripts/test-database.sh` from the repository
root. It starts a disposable PostgreSQL 16 container with no network or published
ports, installs minimal test-only Supabase auth/storage contracts, applies every
migration, and verifies profile privacy, parent isolation, answer-key privileges,
and server-owned exam writes. It does not read project credentials or connect to
the configured Supabase project, and removes the container when finished.
