import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { grantExamAccess, verifyPaystackPayment } from "@/lib/payments/server";
import {
  getApplicationOrigin,
  isPaymentReference,
  PaymentValidationError,
  type VerifiedPayment,
} from "@/lib/payments/validation";

export async function GET(request: NextRequest) {
  let origin: string;
  try {
    origin = getApplicationOrigin(request.url, {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    });
  } catch {
    return NextResponse.json({ error: "Payment callbacks are not configured." }, { status: 503 });
  }
  const params = new URL(request.url).searchParams;
  const reference = params.get("reference") || params.get("trxref");
  if (!isPaymentReference(reference)) {
    return NextResponse.redirect(`${origin}/dashboard?payment=failed`);
  }

  let payment: VerifiedPayment | undefined;
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      const callback = `/api/payments/verify?reference=${encodeURIComponent(reference)}`;
      return NextResponse.redirect(`${origin}/login?redirect=${encodeURIComponent(callback)}`);
    }

    payment = await verifyPaystackPayment(reference, user.id);
    // Complete access before redirecting; webhook delivery may arrive after the callback.
    await grantExamAccess(payment);
    return NextResponse.redirect(`${origin}/exams/${payment.examSlug}/subjects?payment=success`);
  } catch (error) {
    if (payment) {
      const retry = new URL(`/pay/${payment.examSlug}`, origin);
      retry.searchParams.set("payment", "pending");
      retry.searchParams.set("reference", reference);
      return NextResponse.redirect(retry);
    }
    return NextResponse.redirect(
      `${origin}/dashboard?payment=${error instanceof PaymentValidationError ? "failed" : "error"}`,
    );
  }
}
