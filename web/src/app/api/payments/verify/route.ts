import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Payment verification callback — Paystack redirects here after payment
 * Per Doc 03: On payment success → redirect to /exams/[exam]/subjects
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");

  const ref = reference || trxref;

  if (!ref) {
    return NextResponse.redirect(`${origin}/dashboard?payment=failed`);
  }

  try {
    // Verify with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (verifyData.status && verifyData.data.status === "success") {
      const examSlug = verifyData.data.metadata?.exam_slug;

      if (examSlug) {
        // Per Doc 03: After payment success → /exams/[exam]/subjects
        return NextResponse.redirect(
          `${origin}/exams/${examSlug}/subjects?payment=success`
        );
      }

      return NextResponse.redirect(`${origin}/dashboard?payment=success`);
    }

    // Payment failed
    return NextResponse.redirect(`${origin}/dashboard?payment=failed`);
  } catch {
    return NextResponse.redirect(`${origin}/dashboard?payment=error`);
  }
}
