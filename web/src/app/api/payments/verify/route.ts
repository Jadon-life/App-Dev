import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { verifyAndGrantExamAccess } from "@/lib/payments";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference") || url.searchParams.get("trxref");
  if (!reference) return NextResponse.redirect(new URL("/dashboard?payment=failed", url));
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login?error=sign_in_to_verify_payment", url));
  try {
    const { examSlug } = await verifyAndGrantExamAccess(reference, user.id);
    return NextResponse.redirect(new URL(`/exams/${examSlug}/subjects?payment=success`, url));
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.redirect(new URL("/dashboard?payment=error", url));
  }
}
