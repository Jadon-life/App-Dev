import type { SupabaseClient } from "@supabase/supabase-js";
import type { VerifiedPayment } from "./validation";

/** Keep persistence separate so payment retries can be exercised without a live database. */
export async function saveExamAccess(
  payment: VerifiedPayment,
  admin: Pick<SupabaseClient, "from">,
): Promise<void> {
  const { data: exam, error: examError } = await admin
    .from("exams")
    .select("id, price_kobo")
    .eq("slug", payment.examSlug)
    .single();

  if (examError || !exam || exam.price_kobo !== payment.amount) {
    throw new Error("The paid exam could not be resolved.");
  }

  // DO NOTHING on a repeated purchase: keep the original reference and unlock date.
  const { error } = await admin
    .from("user_exam_access")
    .upsert(
      { user_id: payment.userId, exam_id: exam.id, payment_ref: payment.reference },
      { onConflict: "user_id,exam_id", ignoreDuplicates: true },
    );
  if (error) throw new Error("Exam access could not be saved.");
}
