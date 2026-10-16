import { NextResponse } from "next/server";
import {
  normalizeQuestion,
  reviewQuestions,
  sanitizeAnswers,
  type PracticeQuestion,
} from "@/lib/exam";
import { finalizeSubmission } from "@/lib/exam-submission";
import {
  attemptQuestions,
  checkDatabaseError,
  examContext,
  examFailure,
  ExamError,
  ownedAttempt,
  readExamBody,
} from "@/lib/exam-server";

type RouteContext = { params: Promise<{ exam: string; attempt: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const route = await params;
    const context = await examContext(route.exam);
    const attempt = await ownedAttempt(context, route.attempt);
    // New completed attempts retain the exact content/keys used to produce their grade.
    const snapshotRows: unknown[] | null =
      attempt.completed_at && Array.isArray(attempt.review_snapshot)
        ? attempt.review_snapshot
        : null;
    const snapshot =
      snapshotRows
        ?.map((row) => normalizeQuestion(row, true))
        .filter((question): question is PracticeQuestion => question !== null) ?? null;
    const questions =
      snapshot && snapshot.length === attempt.question_ids.length
        ? snapshot
        : await attemptQuestions(context, attempt.question_ids, !!attempt.completed_at);
    const publicAttempt = { ...attempt, review_snapshot: undefined };
    return NextResponse.json(
      {
        attempt: publicAttempt,
        questions: attempt.completed_at ? reviewQuestions(questions, attempt.answers) : questions,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return examFailure(error);
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const route = await params;
    const context = await examContext(route.exam);
    const body = await readExamBody(request);
    const attempt = await ownedAttempt(context, route.attempt);
    if (attempt.completed_at) throw new ExamError("This mock has already been submitted.", 409);
    if (
      !Number.isSafeInteger(body.revision) ||
      (body.revision as number) < 1 ||
      (body.revision as number) > 2147483647
    )
      throw new ExamError("Invalid answer revision.");
    if (Date.now() >= Date.parse(attempt.expires_at))
      throw new ExamError("Time is up. Submit your saved answers to see your result.", 409);
    const questions = await attemptQuestions(context, attempt.question_ids);
    const answers = sanitizeAnswers(body.answers, questions);
    const { data: saved, error } = await context.admin
      .from("mock_attempts")
      .update({ answers, answer_revision: body.revision })
      .eq("id", attempt.id)
      .eq("user_id", context.user.id)
      .is("completed_at", null)
      .lt("answer_revision", body.revision)
      .gt("expires_at", new Date().toISOString())
      .select("id, answer_revision")
      .maybeSingle();
    checkDatabaseError(error);
    if (saved) return NextResponse.json({ saved: true, revision: saved.answer_revision });
    const current = await ownedAttempt(context, attempt.id);
    if (current.completed_at) throw new ExamError("This mock has already been submitted.", 409);
    if (Date.now() >= Date.parse(current.expires_at))
      throw new ExamError("Time is up. Your last changes could not be autosaved.", 409);
    // An older request arriving after a newer revision is an expected safe no-op.
    if (current.answer_revision >= (body.revision as number))
      return NextResponse.json({ saved: true, revision: current.answer_revision });
    throw new ExamError("Your latest answers could not be saved. Please try again.", 503);
  } catch (error) {
    return examFailure(error);
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const route = await params;
    const context = await examContext(route.exam);
    const body = await readExamBody(request);
    const attempt = await ownedAttempt(context, route.attempt);
    if (attempt.completed_at) return NextResponse.json({ id: attempt.id });
    const questions = await attemptQuestions(context, attempt.question_ids, true);
    // CAS on the autosave revision prevents a finalization from overwriting answers
    // that were accepted while this request was fetching the question bank.
    const completedId = await finalizeSubmission(questions, body.answers, attempt, {
      save: async (submission, revision) => {
        const { data: saved, error } = await context.admin
          .from("mock_attempts")
          .update({
            ...submission,
            review_snapshot: questions,
            completed_at: new Date().toISOString(),
          })
          .eq("id", attempt.id)
          .eq("user_id", context.user.id)
          .is("completed_at", null)
          .eq("answer_revision", revision)
          .select("id")
          .maybeSingle();
        checkDatabaseError(error);
        return saved?.id ?? null;
      },
      read: () => ownedAttempt(context, route.attempt),
    });
    if (completedId) return NextResponse.json({ id: completedId });
    throw new ExamError("Your answers are still saving. Please retry submission.", 409);
  } catch (error) {
    return examFailure(error);
  }
}
