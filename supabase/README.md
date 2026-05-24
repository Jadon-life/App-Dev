# PrepHQ — Supabase Database

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
   - `prephq://auth/callback` (mobile)

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
- Users can only read/write their own data
- Parents can view their linked student's data
- Exams are publicly readable (active ones)
- Questions require exam access (paid)
- Exam access is inserted only by server (payment webhook)
