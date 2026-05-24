-- PrepHQ Migration 006: Storage Buckets
-- Source: Document 05 — Backend Schema (File Storage section)

-- Bucket: question-images — Diagrams, charts embedded in questions
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'question-images',
  'question-images',
  true,  -- Public read (questions are accessible once exam is unlocked via app logic)
  5242880,  -- 5MB max per file
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
);

-- Bucket: avatars — User profile photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,  -- Public read for profile photos
  2097152,  -- 2MB max per file
  ARRAY['image/png', 'image/jpeg', 'image/webp']
);

-- Storage Policies: question-images (public read, admin-only write)
CREATE POLICY "Public read question images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'question-images');

-- Storage Policies: avatars (public read, user can upload own)
CREATE POLICY "Public read avatars"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
