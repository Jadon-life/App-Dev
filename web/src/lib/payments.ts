import { createClient } from "@supabase/supabase-js";
import { EXAMS } from "@shared/constants/exams";
import type { ExamSlug } from "@/types/database";

/**
 * Only verified, correctly priced NGN transactions can unlock an exam.
 * Used by both the browser callback and the signed Paystack webhook.
 */
export async function verifyAndGrantExamAccess(
  reference: string,
  expectedUserId?: string
): Promise<{ examSlug: ExamSlug; userId: string }> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const roleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret || !url || !roleKey) {
    throw new Error("Payment service is not configured");
  }
  if (!/^[a-zA-Z0-9._-]{1,200}$/.test(reference)) {
    throw new Error("Invalid transaction reference");
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    }
  );
  if (!response.ok) throw new Error("Paystack verification unavailable");

  const result = await response.json();
  const transaction = result?.data;
  const examSlug = transaction?.metadata?.exam_slug;
  const userId = transaction?.metadata?.user_id;

  if (
    !result?.status ||
    transaction?.status !== "success" ||
    transaction?.reference !== reference ||
    transaction?.currency !== "NGN" ||
    typeof examSlug !== "string" ||
    !Object.prototype.hasOwnProperty.call(EXAMS, examSlug) ||
    typeof userId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)
  ) {
    throw new Error("Invalid payment details");
  }

  if (expectedUserId && userId !== expectedUserId) {
    throw new Error("Payment does not belong to the signed-in user");
  }

  const slug = examSlug as ExamSlug;
  const admin = createClient(url, roleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: exam, error: examError } = await admin
    .from("exams")
    .select("id, price_kobo")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (examError || !exam) {
    throw new Error("Paid exam is unavailable");
  }
  // Check both the advertised price and the current database price.
  // A mismatch must be investigated instead of granting access.
  if (
    !Number.isSafeInteger(transaction.amount) ||
    transaction.amount !== EXAMS[slug].price_kobo ||
    transaction.amount !== exam.price_kobo
  ) {
    throw new Error("Payment amount does not match exam price");
  }

  const { error: accessError } = await admin
    .from("user_exam_access")
    .upsert(
      { user_id: userId, exam_id: exam.id, payment_ref: reference },
      { onConflict: "user_id,exam_id" }
    );

  if (accessError) throw new Error("Could not record exam access");
  return { examSlug: slug, userId };
}
