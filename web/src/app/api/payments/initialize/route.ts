import { NextResponse } from "next/server";
import { EXAMS } from "@shared/constants/exams";
import { createServerSupabase } from "@/lib/supabase-server";
import { getPaystackSecret } from "@/lib/payments/server";
import {
  getApplicationOrigin,
  isExamSlug,
  isPaymentReference,
  isPaystackCheckoutUrl,
} from "@/lib/payments/validation";

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Send valid payment details." }, { status: 400 });
    }
    const examSlug =
      body && typeof body === "object" && "exam_slug" in body ? body.exam_slug : null;
    if (!isExamSlug(examSlug)) {
      return NextResponse.json({ error: "Choose a valid exam." }, { status: 400 });
    }

    const origin = getApplicationOrigin(request.url, {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    });
    const requestOrigin = request.headers.get("origin");
    if (
      requestOrigin &&
      requestOrigin !== new URL(request.url).origin &&
      requestOrigin !== origin
    ) {
      return NextResponse.json({ error: "The request origin is not allowed." }, { status: 403 });
    }

    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Sign in to continue to payment." }, { status: 401 });
    }
    if (!user.email) {
      return NextResponse.json(
        { error: "Add an email address to your account before paying." },
        { status: 400 },
      );
    }

    // Access records reference the public profile, which may be absent for legacy accounts.
    // Fail before charging rather than accepting a payment we cannot fulfil.
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    if (profileError) throw new Error("Account lookup failed.");
    if (!profile) {
      return NextResponse.json(
        {
          error:
            "Your account setup needs attention before you can purchase an exam. Please contact support.",
        },
        { status: 409 },
      );
    }

    const { data: examRow, error: examError } = await supabase
      .from("exams")
      .select("id, price_kobo")
      .eq("slug", examSlug)
      .eq("is_active", true)
      .maybeSingle();
    if (examError) throw new Error("Exam lookup failed.");
    if (!examRow) {
      return NextResponse.json(
        { error: "This exam is not available to purchase." },
        { status: 404 },
      );
    }
    const exam = EXAMS[examSlug];
    if (examRow.price_kobo !== exam.price_kobo) {
      return NextResponse.json(
        { error: "Exam pricing is being updated. Please try again later." },
        { status: 503 },
      );
    }

    const { data: existingAccess, error: accessError } = await supabase
      .from("user_exam_access")
      .select("id")
      .eq("user_id", user.id)
      .eq("exam_id", examRow.id)
      .maybeSingle();
    if (accessError) throw new Error("Exam access lookup failed.");
    if (existingAccess) {
      return NextResponse.json(
        { error: "You already have access to this exam.", already_purchased: true },
        { status: 409 },
      );
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getPaystackSecret()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: exam.price_kobo,
        currency: "NGN",
        callback_url: `${origin}/api/payments/verify`,
        metadata: { exam_slug: examSlug, user_id: user.id },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const result = await response.json();
    if (
      !response.ok ||
      result.status !== true ||
      !isPaystackCheckoutUrl(result.data?.authorization_url) ||
      !isPaymentReference(result.data?.reference)
    ) {
      return NextResponse.json(
        { error: "Checkout is unavailable right now. Please try again." },
        { status: 502 },
      );
    }
    return NextResponse.json({
      authorization_url: result.data.authorization_url,
      access_code: result.data.access_code,
      reference: result.data.reference,
    });
  } catch {
    return NextResponse.json(
      { error: "We could not start checkout. Please try again shortly." },
      { status: 503 },
    );
  }
}
