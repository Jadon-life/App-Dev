#!/usr/bin/env python3
"""Apply the reviewed 00008–00011 migrations using Supabase's Management API.

No project keys, tokens, database passwords or user records are written to disk.
Default mode checks metadata; --apply executes one atomic transaction.
"""
import argparse
import json
import os
from pathlib import Path
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parent.parent
MIGRATIONS = (
    "00008_secure_profile_access.sql",
    "00009_secure_exam_attempts.sql",
    "00010_restore_own_profile_policies.sql",
    "00011_restore_study_read_policies.sql",
)


def project_reference(url):
    parsed = urllib.parse.urlsplit(url)
    match = re.fullmatch(r"([a-z0-9]{20})\.supabase\.co", parsed.hostname or "")
    if parsed.scheme != "https" or not match or parsed.username or parsed.password:
        raise ValueError("Configure the standard HTTPS Supabase project URL before migration.")
    return match.group(1)


def migration_transaction():
    parts = ["BEGIN;", "SELECT pg_advisory_xact_lock(hashtext('cryslearn-schema-00009'));"]
    for filename in MIGRATIONS:
        sql = (ROOT / "supabase" / "migrations" / filename).read_text()
        # 00008 has its own transaction. Both reviewed migrations must commit together.
        sql = re.sub(r"(?m)^(BEGIN|COMMIT);\s*$", "", sql)
        parts.append(sql)
    parts.append("COMMIT;")
    return "\n".join(parts)


CHECK_SQL = """
SELECT
  to_regclass('public.users') IS NOT NULL AND
  to_regclass('public.questions') IS NOT NULL AND
  to_regclass('public.user_exam_access') IS NOT NULL AND
  to_regclass('public.mock_attempts') IS NOT NULL AS base_schema_present,
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public'
    AND table_name='mock_attempts' AND column_name='review_snapshot') AS snapshots_present,
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public'
    AND table_name='mock_attempts' AND column_name='answer_revision') AS revisions_present,
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public'
    AND table_name='mock_attempts' AND column_name='question_ids') AND
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public'
    AND table_name='mock_attempts' AND column_name='expires_at') AS composition_present,
  has_table_privilege('service_role', 'public.mock_attempts', 'UPDATE') AS server_can_grade,
  has_column_privilege('service_role', 'public.questions', 'correct_option', 'SELECT') AS server_can_read_answer_keys,
  EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname='public' AND c.relname='users' AND c.relrowsecurity) AND
  EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users'
    AND policyname='Users can view own profile' AND cmd='SELECT'
    AND roles=ARRAY['authenticated']::name[] AND qual='(auth.uid() = id)') AND
  EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users'
    AND policyname='Users can update own profile' AND cmd='UPDATE'
    AND roles=ARRAY['authenticated']::name[] AND qual='(auth.uid() = id)'
    AND with_check='(auth.uid() = id)') AS own_profile_policies_present,
  has_table_privilege('authenticated', 'public.mock_attempts', 'INSERT') AS client_can_insert_attempts,
  has_table_privilege('authenticated', 'public.mock_attempts', 'UPDATE') AS client_can_update_attempts,
  has_column_privilege('authenticated', 'public.users', 'linked_student_id', 'UPDATE') AS client_can_link_students,
  has_column_privilege('authenticated', 'public.questions', 'correct_option', 'SELECT') AS client_can_read_answer_keys,
  (SELECT COUNT(*) = 2 FROM pg_policies WHERE schemaname='public'
    AND ((tablename='mock_attempts' AND policyname='Users can view own mock attempts')
      OR (tablename='user_exam_access' AND policyname='Users can view own exam access'))
    AND cmd='SELECT' AND roles=ARRAY['authenticated']::name[]
    AND qual='(auth.uid() = user_id)') AND
  (SELECT COUNT(*) = 2 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relname IN ('mock_attempts','user_exam_access')
    AND c.relrowsecurity) AS own_study_policies_present,
  EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='questions'
    AND policyname='Authenticated users can view questions' AND cmd='SELECT'
    AND roles=ARRAY['authenticated']::name[] AND qual='true') AND
  EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relname='questions' AND c.relrowsecurity)
    AS safe_question_policy_present,
  EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND
    policyname IN ('Parents can view linked student', 'Parents can view linked student attempts',
      'Parents can view linked student exam access')) AS unsafe_parent_policy_present;
"""


def management_query(reference, token, query):
    request = urllib.request.Request(
        f"https://api.supabase.com/v1/projects/{reference}/database/query",
        data=json.dumps({"query": query}).encode(),
        headers={"Authorization": "Bearer " + token, "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.load(response)


def ready(state):
    return state.get("base_schema_present") is True and all(
        state.get(name) is True for name in ("snapshots_present", "revisions_present", "composition_present", "server_can_grade", "server_can_read_answer_keys", "own_profile_policies_present", "own_study_policies_present", "safe_question_policy_present")
    ) and all(state.get(name) is False for name in (
        "client_can_insert_attempts", "client_can_update_attempts", "client_can_link_students",
        "client_can_read_answer_keys", "unsafe_parent_policy_present",
    ))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true", help="Apply the reviewed migrations atomically")
    args = parser.parse_args()
    token = os.environ.get("SUPABASE_ACCESS_TOKEN")
    if not token:
        raise ValueError("SUPABASE_ACCESS_TOKEN is missing. Supply it securely in environment settings; do not paste it into chat.")
    reference = project_reference(os.environ.get("NEXT_PUBLIC_SUPABASE_URL", ""))
    before = management_query(reference, token, CHECK_SQL)
    if not isinstance(before, list) or len(before) != 1 or not before[0].get("base_schema_present"):
        raise ValueError("The expected CrysLearn schema was not found. No changes were made.")
    if ready(before[0]):
        print("PASS: Supabase schema and permission checks already match migrations 00008–00011.")
        return
    if not args.apply:
        print("Pending: " + ", ".join(MIGRATIONS) + ". Use --apply for the reviewed atomic migration.")
        return
    management_query(reference, token, migration_transaction())
    after = management_query(reference, token, CHECK_SQL)
    if not isinstance(after, list) or len(after) != 1 or not ready(after[0]):
        raise ValueError("Migration request completed, but schema/permission verification failed. Inspect the project before promoting the deployment.")
    print("PASS: migrations 00008–00011 applied atomically and live schema/permission checks passed.")


if __name__ == "__main__":
    try:
        main()
    except urllib.error.HTTPError as error:
        print(f"Supabase Management API returned HTTP {error.code}; no credential values were logged.", file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as error:
        print(f"Supabase Management API could not be reached: {type(error.reason).__name__}.", file=sys.stderr)
        sys.exit(1)
    except (ValueError, OSError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
