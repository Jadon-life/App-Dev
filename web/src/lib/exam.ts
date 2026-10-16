import { EXAMS, EXAM_SLUGS } from "../../../shared/constants/exams";
import type { ExamSlug, OptionLabel, QuestionOption } from "../types/database";

export interface PracticeQuestion {
  id: string;
  subject: string;
  year: number;
  question_text: string;
  options: QuestionOption[];
  correct_option?: OptionLabel;
  explanation?: string;
}
export interface ReviewedQuestion extends PracticeQuestion {
  correct_option: OptionLabel;
  user_answer: OptionLabel | null;
  is_correct: boolean;
}
export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (value: unknown): value is string =>
  typeof value === "string" && UUID_PATTERN.test(value);
export const isOptionLabel = (value: unknown): value is OptionLabel =>
  typeof value === "string" && ["A", "B", "C", "D"].includes(value);

// Check own keys: /exams/__proto__ must never resolve a prototype as an exam.
export function getExam(value: unknown) {
  return typeof value === "string" && EXAM_SLUGS.includes(value as ExamSlug)
    ? EXAMS[value as ExamSlug]
    : null;
}

export function parseSubjects(value: unknown, allowed: readonly string[]): string[] {
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(parsed) || parsed.length > allowed.length) return [];
  if (parsed.some((item) => typeof item !== "string" || !allowed.includes(item))) return [];
  return [...new Set(parsed as string[])];
}

export function parseOptions(value: unknown): QuestionOption[] | null {
  let parsed = value;
  // Legacy seed data sometimes stored JSON inside a JSONB string.
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return null;
    }
  }
  if (!Array.isArray(parsed) || parsed.length < 2 || parsed.length > 4) return null;
  const options: QuestionOption[] = [];
  for (const option of parsed) {
    if (
      !option ||
      typeof option !== "object" ||
      !isOptionLabel(option.label) ||
      typeof option.text !== "string" ||
      !option.text.trim()
    )
      return null;
    if (options.some((existing) => existing.label === option.label)) return null;
    options.push({ label: option.label, text: option.text });
  }
  return options;
}

export function normalizeQuestion(value: unknown, requireAnswer = false): PracticeQuestion | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const options = parseOptions(row.options);
  if (
    !isUuid(row.id) ||
    typeof row.question_text !== "string" ||
    !row.question_text.trim() ||
    typeof row.subject !== "string" ||
    !row.subject.trim() ||
    !Number.isInteger(row.year) ||
    !options
  )
    return null;
  if (
    requireAnswer &&
    (!isOptionLabel(row.correct_option) ||
      !options.some((option) => option.label === row.correct_option))
  )
    return null;
  return {
    id: row.id,
    question_text: row.question_text,
    subject: row.subject,
    year: row.year as number,
    options,
    ...(isOptionLabel(row.correct_option) ? { correct_option: row.correct_option } : {}),
    ...(typeof row.explanation === "string" ? { explanation: row.explanation } : {}),
  };
}

export function sanitizeAnswers(
  value: unknown,
  questions: readonly PracticeQuestion[],
): Record<string, OptionLabel> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const source = value as Record<string, unknown>;
  return Object.fromEntries(
    questions.flatMap((question) => {
      const answer = source[question.id];
      return isOptionLabel(answer) && question.options.some((option) => option.label === answer)
        ? [[question.id, answer]]
        : [];
    }),
  );
}

export function reviewQuestions(
  questions: readonly PracticeQuestion[],
  answers: unknown,
): ReviewedQuestion[] {
  const cleaned = sanitizeAnswers(answers, questions);
  return questions.map((question) => {
    if (!question.correct_option) throw new Error("A question is missing its answer key.");
    return {
      ...question,
      correct_option: question.correct_option,
      user_answer: cleaned[question.id] ?? null,
      is_correct: cleaned[question.id] === question.correct_option,
    };
  });
}

export function calculateScore(results: readonly { is_correct: boolean }[]): number {
  return results.length
    ? Math.round((results.filter((question) => question.is_correct).length / results.length) * 100)
    : 0;
}

export function remainingSeconds(expiresAt: string | number, now = Date.now()): number {
  const deadline = typeof expiresAt === "number" ? expiresAt : Date.parse(expiresAt);
  return Number.isFinite(deadline) ? Math.max(0, Math.ceil((deadline - now) / 1000)) : 0;
}

// Fisher–Yates avoids the biased sort(() => Math.random() - .5) comparator.
export function shuffled<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

export function balancedQuestions(
  pools: readonly PracticeQuestion[][],
  count: number,
): PracticeQuestion[] {
  const result: PracticeQuestion[] = [];
  const seen = new Set<string>();
  const depth = Math.max(0, ...pools.map((pool) => pool.length));
  for (let row = 0; row < depth && result.length < count; row++) {
    for (const pool of pools) {
      const question = pool[row];
      if (question && !seen.has(question.id) && result.length < count) {
        result.push(question);
        seen.add(question.id);
      }
    }
  }
  return result;
}

export function readMockDraft(raw: string | null): {
  id?: string;
  answers?: unknown;
  revision: number;
} {
  let value: unknown;
  try {
    value = raw ? JSON.parse(raw) : null;
  } catch {
    return { revision: 0 };
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return { revision: 0 };
  const source = value as Record<string, unknown>;
  return {
    ...(isUuid(source.id) ? { id: source.id } : {}),
    answers: source.answers,
    revision:
      Number.isSafeInteger(source.revision) &&
      (source.revision as number) >= 0 &&
      (source.revision as number) <= 2147483647
        ? (source.revision as number)
        : 0,
  };
}
