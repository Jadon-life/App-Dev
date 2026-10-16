export async function examRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  const body = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(body?.error || "We couldn't complete that request. Please try again.");
  return body as T;
}

import type { OptionLabel } from "../types/database";
import type { PracticeQuestion, ReviewedQuestion } from "./exam";
export interface SavedAttempt {
  id: string;
  subjects: string[];
  answers: Record<string, OptionLabel>;
  score: number;
  started_at: string;
  expires_at: string;
  completed_at: string | null;
  answer_revision: number;
}
export interface AttemptPayload {
  attempt: SavedAttempt;
  questions: (PracticeQuestion | ReviewedQuestion)[];
}
