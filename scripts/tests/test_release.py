import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("release", Path(__file__).resolve().parents[1] / "apply-supabase-migrations.py")
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)

class ReleaseSafetyTests(unittest.TestCase):
    def test_project_reference_never_sends_management_token_to_a_custom_host(self):
        self.assertEqual(release.project_reference("https://abcdefghijklmnopqrst.supabase.co"), "abcdefghijklmnopqrst")
        for url in ["http://abcdefghijklmnopqrst.supabase.co", "https://supabase.co.attacker.example", "https://user:secret@abcdefghijklmnopqrst.supabase.co", "https://abcdefghijklmnopqrst.supabase.co.attacker.example"]:
            with self.assertRaises(ValueError):
                release.project_reference(url)

    def test_migrations_have_exactly_one_outer_atomic_transaction(self):
        sql = release.migration_transaction()
        self.assertEqual(sql.count("BEGIN;"), 1)
        self.assertEqual(sql.count("COMMIT;"), 1)
        self.assertTrue(sql.rstrip().endswith("COMMIT;"))
        self.assertIn("pg_advisory_xact_lock", sql)
        self.assertIn("review_snapshot", sql)
        self.assertIn('"Parents can view linked student"', sql)

    def test_success_requires_every_schema_and_permission_gate(self):
        state = dict.fromkeys(["base_schema_present", "snapshots_present", "revisions_present", "composition_present", "server_can_grade", "server_can_read_answer_keys"], True)
        state.update(dict.fromkeys(["client_can_insert_attempts", "client_can_update_attempts", "client_can_link_students", "client_can_read_answer_keys", "unsafe_parent_policy_present"], False))
        self.assertTrue(release.ready(state))
        for key in state:
            invalid = {**state, key: not state[key]}
            self.assertFalse(release.ready(invalid), key)
        self.assertFalse(release.ready({}))

if __name__ == "__main__":
    unittest.main()
