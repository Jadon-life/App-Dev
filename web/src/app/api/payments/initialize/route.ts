import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { EXAMS } from "@shared/constants/exams";
import type { ExamSlug } from "@/types/database";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { exam_slug, email } = body;

    // Validate exam slug
    const exam = EXAMS[exam_slug as ExamSlug];
    if (!exam) {
      return NextResponse.json(
        { error: "Invalid exam" },
        { status: 400 }
      );
    }

    // Get authenticated user
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Can't set cookies in route handler response
            }
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if already purchased
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingAccess } = await (supabase as any)
      .from("user_exam_access")
      .select("id")
      .eq("user_id", user.id)
      .eq("exam_id", exam_slug)
      .single();

    if (existingAccess) {
      return NextResponse.json(
        { error: "You already have access to this exam" },
        { status: 400 }
      );
    }

    // Initialize Paystack payment
    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email || user.email,
          amount: exam.price_kobo, // Amount in kobo
          currency: "NGN",
          callback_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin : "http://localhost:3000"}/api/payments/verify`,
          metadata: {
            exam_slug: exam_slug,
            exam_id: exam_slug, // Will be resolved to UUID on webhook
            user_id: user.id,
            custom_fields: [
              {
                display_name: "Exam",
                variable_name: "exam",
                value: exam.name,
              },
            ],
          },
        }),
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      return NextResponse.json(
        { error: paystackData.message || "Payment initialization failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
      reference: paystackData.data.reference,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
