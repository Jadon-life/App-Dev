import assert from "node:assert/strict";
import test from "node:test";
import {
  createEmptyWeek,
  parseStudySchedule,
  scheduleStorageKey,
  countStudyTasks,
} from "./study-schedule";

test("planner rejects corrupt, incomplete and invalid saved tasks", () => {
  for (const value of ["{", "null", "[]", "{}", '{"Monday":null}']) {
    assert.equal(parseStudySchedule(value), null);
  }
  const week = createEmptyWeek();
  week.Monday.morning.push({ subject: "Mathematics", topic: " " });
  assert.equal(parseStudySchedule(JSON.stringify(week)), null);
  week.Monday.morning[0].topic = "x".repeat(181);
  assert.equal(parseStudySchedule(JSON.stringify(week)), null);
});

test("planner restores a whole week without sharing day arrays", () => {
  const week = createEmptyWeek();
  week.Monday.morning.push({ subject: "Mathematics", topic: " Quadratic equations " });
  const restored = parseStudySchedule(JSON.stringify(week));
  assert.ok(restored);
  assert.equal(restored.Monday.morning[0].topic, "Quadratic equations");
  assert.equal(restored.Tuesday.morning.length, 0);
  assert.equal(countStudyTasks(restored), 1);
  assert.equal(countStudyTasks(restored, "Tuesday"), 0);
});

test("planner storage is scoped to the signed-in account", () => {
  assert.notEqual(scheduleStorageKey("student-a"), scheduleStorageKey("student-b"));
  assert.notEqual(scheduleStorageKey("student-a"), "cryslearn-schedule");
});
