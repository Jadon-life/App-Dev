-- Minimal Supabase platform contracts for an isolated vanilla PostgreSQL test.
-- These are test-only schemas, never part of a production migration.
CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
CREATE ROLE service_role NOLOGIN BYPASSRLS;
CREATE SCHEMA auth;
CREATE SCHEMA storage;
GRANT USAGE ON SCHEMA public, auth, storage TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
CREATE TABLE auth.users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  raw_user_meta_data JSONB NOT NULL DEFAULT '{}'
);
CREATE FUNCTION auth.uid() RETURNS UUID LANGUAGE SQL STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::UUID
$$;
CREATE FUNCTION auth.role() RETURNS TEXT LANGUAGE SQL STABLE AS $$
  SELECT COALESCE(NULLIF(current_setting('request.jwt.claim.role', true), ''), current_user)
$$;
CREATE TABLE storage.buckets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  public BOOLEAN NOT NULL DEFAULT false,
  file_size_limit BIGINT,
  allowed_mime_types TEXT[]
);
CREATE TABLE storage.objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id TEXT REFERENCES storage.buckets(id),
  name TEXT NOT NULL
);
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION storage.foldername(name TEXT) RETURNS TEXT[] LANGUAGE SQL IMMUTABLE AS $$
  SELECT (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1]
$$;
