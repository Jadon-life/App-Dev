import {
  finalizeSubmission,
  prepareSubmission,
  type SubmissionAttempt,
} from "../src/lib/exam-submission";
import assert from "node:assert/strict";
import test from "node:test";
import {
  balancedQuestions,
  calculateScore,
  getExam,
  normalizeQuestion,
  parseOptions,
  parseSubjects,
  remainingSeconds,
  readMockDraft,
  reviewQuestions,
  sanitizeAnswers,
  shuffled,
  type PracticeQuestion,
} from "../src/lib/exam";
const first = "11111111-1111-4111-8111-111111111111";
const second = "22222222-2222-4222-8222-222222222222";
const options = [
  { label: "A" as const, text: "One" },
  { label: "B" as const, text: "Two" },
];
const question = (id = first, subject = "Mathematics"): PracticeQuestion => ({
  id,
  subject,
  year: 2025,
  question_text: "1 + 1?",
  options,
  correct_option: "B",
});

test("route and subject input rejects inherited keys, hidden exams and arbitrary JSON shapes", () => {
  assert.equal(getExam("__proto__"), null);
  assert.equal(getExam("constructor"), null);
  assert.equal(getExam("neco"), null);
  assert.equal(getExam("jamb")?.name, "UTME");
  assert.deepEqual(parseSubjects('"Mathematics"', ["Mathematics"]), []);
  assert.deepEqual(parseSubjects('["Unknown"]', ["Mathematics"]), []);
  assert.deepEqual(parseSubjects('["Mathematics",42]', ["Mathematics", "Physics"]), []);
  assert.deepEqual(parseSubjects('["Mathematics","Mathematics"]', ["Mathematics", "Physics"]), [
    "Mathematics",
  ]);
});

test("legacy JSON options are normalized and malformed or duplicate options rejected", () => {
  assert.deepEqual(parseOptions(JSON.stringify(options)), options);
  for (const malformed of [
    "{",
    {},
    null,
    [],
    [
      { label: "A", text: "One" },
      { label: "A", text: "Two" },
    ],
    [{ label: "E", text: "One" }, options[1]],
  ])
    assert.equal(parseOptions(malformed), null);
  assert.equal(normalizeQuestion({ ...question(), correct_option: "D" }, true), null);
  assert.equal(normalizeQuestion({ ...question(), options: "invalid" }), null);
  assert.equal(normalizeQuestion({ ...question(), id: "bad-id" }), null);
});

test("grading ignores foreign questions and invalid options, includes unanswered questions in denominator", () => {
  const questions = [question(), question(second, "Physics")];
  const answers = { [first]: "B", [second]: "D", unrelated: "A" };
  assert.deepEqual(sanitizeAnswers(answers, questions), { [first]: "B" });
  const reviewed = reviewQuestions(questions, answers);
  assert.equal(reviewed[1].user_answer, null);
  assert.equal(calculateScore(reviewed), 50);
  assert.equal(calculateScore([]), 0);
});

test("deadline follows elapsed wall-clock time through a sleeping tab", () => {
  const end = Date.parse("2026-10-16T12:00:00.000Z");
  assert.equal(remainingSeconds(end, end - 90500), 91);
  assert.equal(remainingSeconds(end, end - 500), 1);
  assert.equal(remainingSeconds(end, end + 60000), 0);
  assert.equal(remainingSeconds("not-a-date", end), 0);
});

test("mock selection represents each requested subject before taking extra questions", () => {
  const a = question();
  const b = question(second, "Physics");
  assert.deepEqual(
    balancedQuestions([[a, a], [b]], 2).map((item) => item.subject),
    ["Mathematics", "Physics"],
  );
  assert.equal(balancedQuestions([[a, a], [a]], 60).length, 1);
  const input = [1, 2, 3, 4];
  assert.deepEqual(shuffled(input, () => 0).sort(), input);
  assert.deepEqual(input, [1, 2, 3, 4]);
});

test("server grading uses saved answers after expiry and ignores foreign/forged choices", () => {
  const deadline = "2026-10-16T12:00:00.000Z";
  const time = Date.parse(deadline);
  const questions = [question(), question(second)];
  const posted = { [first]: "B", [second]: "B", foreign: "B", score: 100 };
  const saved = { [first]: "A" };
  const before = prepareSubmission(questions, posted, saved, deadline, time - 1);
  assert.equal(before.score, 100);
  assert.deepEqual(before.answers, { [first]: "B", [second]: "B" });
  assert.equal(prepareSubmission(questions, posted, saved, deadline, time + 4999).score, 100);
  const expired = prepareSubmission(questions, posted, saved, deadline, time + 5001);
  assert.equal(expired.score, 0);
  assert.deepEqual(expired.answers, saved);
  assert.throws(() => prepareSubmission(questions, posted, saved, "invalid", time), /deadline/);
  assert.deepEqual(balancedQuestions([[questions[0], questions[0], questions[1]]], 3), questions);
});

test("malformed cache values cannot prevent opening a mock or inject an invalid revision", () => {
  for (const raw of [null, "null", "[]", "42", '"text"', "{"])
    assert.deepEqual(readMockDraft(raw), { revision: 0 });
  assert.deepEqual(
    readMockDraft(JSON.stringify({ id: first, revision: 3, answers: { [first]: "B" } })),
    { id: first, revision: 3, answers: { [first]: "B" } },
  );
  assert.equal(readMockDraft('{"revision":1e30}').revision, 0);
  assert.equal(readMockDraft('{"revision":-1}').revision, 0);
});

test("finalization rereads accepted autosaves when its revision comparison loses a race", async () => {
  const deadline = "2026-10-16T12:00:00.000Z";
  const attempt: SubmissionAttempt = {
    id: first,
    answers: { [first]: "A" },
    expires_at: deadline,
    answer_revision: 1,
    completed_at: null,
  };
  let attempts = 0;
  const id = await finalizeSubmission([question()], {}, attempt, {
    now: () => Date.parse(deadline) + 10000,
    save: async (submission, revision) => {
      attempts += 1;
      if (attempts === 1) {
        assert.equal(revision, 1);
        return null;
      }
      assert.equal(revision, 2);
      assert.deepEqual(submission.answers, { [first]: "B" });
      assert.equal(submission.score, 100);
      return first;
    },
    read: async () => ({ ...attempt, answers: { [first]: "B" }, answer_revision: 2 }),
  });
  assert.equal(id, first);
  assert.equal(attempts, 2);
});

test("completed submissions are idempotent and repeated revision conflicts fail without fabricated success", async () => {
  const attempt: SubmissionAttempt = {
    id: first,
    answers: {},
    expires_at: "2026-10-16T12:00:00.000Z",
    answer_revision: 1,
    completed_at: "2026-10-16T11:59:00.000Z",
  };
  let writes = 0;
  const save = async () => {
    writes += 1;
    return null;
  };
  const completed = await finalizeSubmission([question()], {}, attempt, {
    save,
    read: async () => attempt,
  });
  assert.equal(completed, first);
  assert.equal(writes, 0);
  const incomplete = { ...attempt, completed_at: null };
  const conflicted = await finalizeSubmission([question()], {}, incomplete, {
    save,
    read: async () => incomplete,
  });
  assert.equal(conflicted, null);
  assert.equal(writes, 3);
});
