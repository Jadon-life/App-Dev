import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Use service role key to bypass RLS (admin operation)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: Request) {
  try {
    const body = await request.text();

    // Verify Paystack webhook signature (per Doc 05: payment verification)
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    const signature = request.headers.get("x-paystack-signature");

    if (hash !== signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    // Only handle successful charges
    if (event.event !== "charge.success") {
      return NextResponse.json({ received: true });
    }

    const { reference, metadata } = event.data;
    const { exam_slug, user_id } = metadata;

    if (!exam_slug || !user_id) {
      return NextResponse.json(
        { error: "Missing metadata" },
        { status: 400 }
      );
    }

    // Get the exam UUID from slug
    const { data: exam, error: examError } = await supabaseAdmin
      .from("exams")
      .select("id")
      .eq("slug", exam_slug)
      .single();

    if (examError || !exam) {
      // Log error but still return 200 to prevent Paystack retries
      console.error("Exam not found for slug:", exam_slug);
      return NextResponse.json({ received: true, error: "Exam not found" });
    }

    // Insert access record (unlock exam for user)
    const { error: insertError } = await supabaseAdmin
      .from("user_exam_access")
      .upsert(
        {
          user_id,
          exam_id: exam.id,
          payment_ref: reference,
          unlocked_at: new Date().toISOString(),
        },
        { onConflict: "user_id,exam_id" }
      );

    if (insertError) {
      console.error("Failed to insert exam access:", insertError);
      return NextResponse.json({
        received: true,
        error: "Failed to unlock exam",
      });
    }

    return NextResponse.json({
      received: true,
      status: "success",
      exam_unlocked: exam_slug,
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
