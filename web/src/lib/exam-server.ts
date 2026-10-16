import "server-only";
import { NextResponse } from "next/server";
import { createAdminClient, createServerSupabase } from "./supabase-server";
import { getExam, normalizeQuestion, isUuid, type PracticeQuestion } from "./exam";

export class ExamError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export async function examContext(slug: string) {
  const config = getExam(slug);
  if (!config) throw new ExamError("This exam is not available.", 404);
  const {
    data: { user },
    error,
  } = await (await createServerSupabase()).auth.getUser();
  if (error || !user) throw new ExamError("Sign in to continue with your exam preparation.", 401);
  // Server-only client: never trust a browser-supplied user, grade, exam ID or deadline.
  const admin = createAdminClient();
  const { data: exam, error: examError } = await admin
    .from("exams")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (examError || !exam) throw new ExamError("This exam is currently unavailable.", 404);
  return { config, user, admin, exam };
}
export type ExamContext = Awaited<ReturnType<typeof examContext>>;

export async function readExamBody(request: Request): Promise<Record<string, unknown>> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    throw new ExamError("This request is not allowed.", 403);
  const raw = await request.text();
  if (raw.length > 32768) throw new ExamError("The request is too large.", 413);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    throw new ExamError("The request contains invalid JSON.");
  }
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new ExamError("The request must contain an object.");
  return body as Record<string, unknown>;
}

export function examFailure(error: unknown) {
  if (error instanceof ExamError)
    return NextResponse.json({ error: error.message }, { status: error.status });
  console.error(
    "Exam API request failed",
    error instanceof Error ? error.message : "Database request failed",
  );
  return NextResponse.json(
    { error: "Exam preparation is temporarily unavailable. Please try again." },
    { status: 503 },
  );
}

export function checkDatabaseError(error: { code?: string } | null) {
  if (!error) return;
  if (["42703", "42883", "PGRST202", "PGRST204"].includes(error.code ?? ""))
    throw new ExamError(
      "Exam setup needs the latest database migration. Please contact support.",
      503,
    );
  throw new ExamError("Your exam could not be saved. Please try again.", 503);
}

export async function ownedAttempt(context: ExamContext, id: string) {
  if (!isUuid(id)) throw new ExamError("This attempt could not be found.", 404);
  const { data, error } = await context.admin
    .from("mock_attempts")
    .select(
      "id, user_id, exam_id, subjects, answers, score, started_at, completed_at, question_ids, expires_at, answer_revision, review_snapshot",
    )
    .eq("id", id)
    .eq("user_id", context.user.id)
    .eq("exam_id", context.exam.id)
    .maybeSingle();
  checkDatabaseError(error);
  if (!data) throw new ExamError("This attempt could not be found.", 404);
  if (!Array.isArray(data.question_ids) || !data.question_ids.length || !data.expires_at)
    throw new ExamError(
      "This older attempt has no saved question list. Start a new mock to review individual answers.",
      409,
    );
  return data;
}

export async function attemptQuestions(
  context: ExamContext,
  ids: string[],
  includeAnswers = false,
): Promise<PracticeQuestion[]> {
  const { data, error } = await context.admin
    .from("questions")
    .select(
      includeAnswers
        ? "id, subject, year, question_text, options, correct_option, explanation"
        : "id, subject, year, question_text, options",
    )
    .eq("exam_id", context.exam.id)
    .in("id", ids);
  checkDatabaseError(error);
  const normalized = (data ?? []).map((row: unknown) => normalizeQuestion(row, includeAnswers));
  const byId = new Map(
    normalized.flatMap((question: PracticeQuestion | null) =>
      question ? [[question.id, question] as const] : [],
    ),
  );
  const ordered = ids.map((id) => byId.get(id));
  if (ordered.some((question) => !question))
    throw new ExamError(
      "Some questions in this attempt are unavailable. Please contact support.",
      409,
    );
  return ordered as PracticeQuestion[];
}
