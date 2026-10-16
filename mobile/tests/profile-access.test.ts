import assert from "node:assert/strict";
import test from "node:test";
import { editableProfile, progressLearnerId } from "../src/lib/profile-access";

test("mobile progress is restricted to the signed-in student even with legacy parent links", () => {
  assert.equal(progressLearnerId("student-id", "student"), "student-id");
  assert.equal(progressLearnerId("parent-id", "parent"), undefined);
  assert.equal(progressLearnerId("unknown-id", undefined), undefined);
  assert.equal(progressLearnerId(undefined, "student"), undefined);
});
test("mobile profile edits exclude protected columns and validate the display name", () => {
  assert.deepEqual(editableProfile(" Ada ", "parent"), { name: "Ada", role: "parent" });
  assert.throws(() => editableProfile(" ", "student"));
  assert.throws(() => editableProfile("a".repeat(101), "student"));
});
