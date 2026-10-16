import assert from "node:assert/strict";
import test from "node:test";
import { summarizeAttempts } from "./study-progress";

test("progress excludes unfinished and invalid records while preserving a real zero score", () => {
  const completed_at = "2026-10-16T10:00:00Z";
  const result = summarizeAttempts([
    { score: 0, completed_at },
    { score: 80, completed_at },
    { score: 100, completed_at: null },
    { score: 200, completed_at },
    { score: NaN, completed_at },
    { score: 80, completed_at: "invalid" },
  ]);
  assert.equal(result.completed.length, 2);
  assert.equal(result.average, 40);
  assert.equal(result.best, 80);
});

test("no earned results means no fabricated average or best score", () => {
  assert.deepEqual(summarizeAttempts([]), { completed: [], average: null, best: null });
});
