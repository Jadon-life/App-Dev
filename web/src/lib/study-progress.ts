export interface ScoredAttempt {
  score: number | null;
  completed_at: string | null;
}

/** Incomplete attempts and malformed scores must never appear as earned results. */
export function summarizeAttempts<T extends ScoredAttempt>(attempts: readonly T[]) {
  const completed = attempts.filter(
    (attempt) =>
      attempt.completed_at !== null &&
      Number.isFinite(Date.parse(attempt.completed_at)) &&
      typeof attempt.score === "number" &&
      Number.isFinite(attempt.score) &&
      attempt.score >= 0 &&
      attempt.score <= 100,
  );
  const scores = completed.map((attempt) => attempt.score as number);
  return {
    completed,
    average: scores.length
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : null,
    best: scores.length ? Math.max(...scores) : null,
  };
}
