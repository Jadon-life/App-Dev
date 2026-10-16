import { NextResponse } from "next/server";
import { isUuid, normalizeQuestion } from "@/lib/exam";
import { checkDatabaseError, examContext, examFailure, ExamError } from "@/lib/exam-server";

export async function GET(request: Request, { params }: { params: Promise<{ exam: string }> }) {
  try {
    const { exam } = await params;
    const context = await examContext(exam);
    const search = new URL(request.url).searchParams;
    const subject = search.get("subject") || "";
    const year = search.get("year") || "";
    const page = Number(search.get("page") || "1");
    if (subject && !context.config.subjects.includes(subject))
      throw new ExamError("Choose a valid subject.");
    if (year && (!/^\d{4}$/.test(year) || Number(year) < 2000 || Number(year) > 2030))
      throw new ExamError("Choose a valid year.");
    if (!Number.isSafeInteger(page) || page < 1 || page > 10000)
      throw new ExamError("Choose a valid page.");
    // Practice mode deliberately provides explanations; mock mode uses a separate payload.
    const reveal = search.get("answer");
    if (reveal) {
      if (!isUuid(reveal)) throw new ExamError("This question could not be found.", 404);
      const { data, error } = await context.admin
        .from("questions")
        .select("id, subject, year, question_text, options, correct_option, explanation")
        .eq("exam_id", context.exam.id)
        .eq("id", reveal)
        .maybeSingle();
      checkDatabaseError(error);
      const question = normalizeQuestion(data, true);
      if (!question) throw new ExamError("This question is unavailable.", 404);
      return NextResponse.json({ question }, { headers: { "Cache-Control": "private, no-store" } });
    }
    let query = context.admin
      .from("questions")
      .select("id, subject, year, question_text, options", { count: "exact" })
      .eq("exam_id", context.exam.id);
    if (subject) query = query.eq("subject", subject);
    if (year) query = query.eq("year", Number(year));
    const { data, count, error } = await query
      .order("year", { ascending: false })
      .order("subject")
      .order("id")
      .range((page - 1) * 20, page * 20 - 1);
    checkDatabaseError(error);
    const questions = (data ?? [])
      .map((row: unknown) => normalizeQuestion(row))
      .filter((question): question is NonNullable<typeof question> => !!question);
    // Derive year options from real records; schema bounds are not evidence of data.
    const { data: yearRows, error: yearError } = await context.admin.rpc("exam_question_years", {
      p_exam_id: context.exam.id,
    });
    checkDatabaseError(yearError);
    const years = [
      ...new Set<number>((yearRows ?? []).map((row: { year: number }) => row.year)),
    ].sort((a, b) => b - a);
    return NextResponse.json(
      {
        questions,
        count: count ?? 0,
        years,
        page,
        pageSize: 20,
        unavailable: (data?.length ?? 0) - questions.length,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return examFailure(error);
  }
}
