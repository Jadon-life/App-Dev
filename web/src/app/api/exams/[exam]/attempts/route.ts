import { NextResponse } from "next/server";
import { balancedQuestions, isUuid, normalizeQuestion, parseSubjects, shuffled } from "@/lib/exam";
import {
  checkDatabaseError,
  examContext,
  examFailure,
  ExamError,
  readExamBody,
} from "@/lib/exam-server";

export async function POST(request: Request, { params }: { params: Promise<{ exam: string }> }) {
  try {
    const { exam } = await params;
    const context = await examContext(exam);
    const body = await readExamBody(request);
    const subjects = parseSubjects(body.subjects, context.config.subjects);
    if (!subjects.length) throw new ExamError("Choose at least one valid subject.");
    if (!isUuid(body.id)) throw new ExamError("A valid attempt ID is required.");
    // A stable browser-generated ID makes retries and React remounts idempotent.
    const { data: existing, error: existingError } = await context.admin
      .from("mock_attempts")
      .select("id")
      .eq("id", body.id)
      .eq("user_id", context.user.id)
      .eq("exam_id", context.exam.id)
      .maybeSingle();
    checkDatabaseError(existingError);
    if (existing) return NextResponse.json({ id: existing.id });
    const pools = await Promise.all(
      subjects.map(async (subject) => {
        const { data, error } = await context.admin
          .from("questions")
          .select("id, subject, year, question_text, options, correct_option")
          .eq("exam_id", context.exam.id)
          .eq("subject", subject)
          .order("year", { ascending: false })
          .order("id")
          .limit(context.config.mockQuestionCount * 3);
        checkDatabaseError(error);
        const valid = (data ?? [])
          .map((row: unknown) => normalizeQuestion(row, true))
          .filter((question): question is NonNullable<typeof question> => !!question);
        if (!valid.length)
          throw new ExamError(
            `There are no usable ${subject} questions yet. Choose another subject.`,
            409,
          );
        return shuffled(valid);
      }),
    );
    const questions = shuffled(
      balancedQuestions(shuffled(pools), context.config.mockQuestionCount),
    );
    if (!questions.length)
      throw new ExamError("No questions are available for these subjects yet.", 409);
    const startedAt = new Date();
    const { error } = await context.admin.from("mock_attempts").insert({
      id: body.id,
      user_id: context.user.id,
      exam_id: context.exam.id,
      subjects,
      answers: {},
      score: 0,
      question_ids: questions.map((question) => question.id),
      started_at: startedAt.toISOString(),
      expires_at: new Date(
        startedAt.getTime() + context.config.mockDurationMinutes * 60000,
      ).toISOString(),
      answer_revision: 0,
    });
    if (error?.code === "23505") {
      const { data: retry } = await context.admin
        .from("mock_attempts")
        .select("id")
        .eq("id", body.id)
        .eq("user_id", context.user.id)
        .eq("exam_id", context.exam.id)
        .maybeSingle();
      if (retry) return NextResponse.json({ id: retry.id });
    }
    checkDatabaseError(error);
    return NextResponse.json({ id: body.id }, { status: 201 });
  } catch (error) {
    return examFailure(error);
  }
}
