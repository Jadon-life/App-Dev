import { calculateScore, reviewQuestions, sanitizeAnswers, type PracticeQuestion } from "./exam";

export const SUBMISSION_TRANSPORT_GRACE_MS = 5000;

/** Derive every stored grade from server-held question IDs/keys, never a posted score. */
export function prepareSubmission(
  questions: readonly PracticeQuestion[],
  postedAnswers: unknown,
  savedAnswers: unknown,
  expiresAt: string,
  now = Date.now(),
) {
  const deadline = Date.parse(expiresAt);
  if (!Number.isFinite(deadline)) throw new Error("The attempt deadline is invalid.");
  const source = now <= deadline + SUBMISSION_TRANSPORT_GRACE_MS ? postedAnswers : savedAnswers;
  const answers = sanitizeAnswers(source, questions);
  const reviewed = reviewQuestions(questions, answers);
  return { answers, score: calculateScore(reviewed) };
}

export interface SubmissionAttempt {
  id: string;
  answers: unknown;
  expires_at: string;
  answer_revision: number;
  completed_at: string | null;
}

/** Retry a compare-and-swap when a valid autosave lands during finalization. */
export async function finalizeSubmission(
  questions: readonly PracticeQuestion[],
  postedAnswers: unknown,
  initial: SubmissionAttempt,
  operations: {
    save: (
      submission: ReturnType<typeof prepareSubmission>,
      expectedRevision: number,
    ) => Promise<string | null>;
    read: () => Promise<SubmissionAttempt>;
    now?: () => number;
  },
): Promise<string | null> {
  let attempt = initial;
  for (let retry = 0; retry < 3; retry++) {
    if (attempt.completed_at) return attempt.id;
    const submission = prepareSubmission(
      questions,
      postedAnswers,
      attempt.answers,
      attempt.expires_at,
      operations.now?.() ?? Date.now(),
    );
    const id = await operations.save(submission, attempt.answer_revision);
    if (id) return id;
    attempt = await operations.read();
  }
  return attempt.completed_at ? attempt.id : null;
}
