import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { EXAMS } from "@shared/constants/exams";
import type { ExamSlug } from "@/types/database";

export async function POST(request: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) return NextResponse.json({ error: "Payments are unavailable" }, { status: 503 });
    const payload = await request.json().catch(() => null);
    const slug = payload?.exam_slug;
    if (typeof slug !== "string" || !Object.prototype.hasOwnProperty.call(EXAMS, slug)) {
      return NextResponse.json({ error: "Invalid exam" }, { status: 400 });
    }
    const supabase = createServerSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user?.email) {
      return NextResponse.json({ error: "Sign in to continue" }, { status: 401 });
    }
    const { data: examRow, error: examError } = await supabase.from("exams")
      .select("id,price_kobo").eq("slug", slug).eq("is_active", true).single();
    // The existing hand-authored Database schema lacks the relationship metadata
    // Supabase needs to infer rows from narrowed selects.
    const exam = examRow as { id: string; price_kobo: number } | null;
    if (examError || !exam || exam.price_kobo !== EXAMS[slug as ExamSlug].price_kobo) {
      return NextResponse.json({ error: "Exam pricing is currently unavailable" }, { status: 409 });
    }
    const { data: access, error: accessError } = await supabase.from("user_exam_access")
      .select("id").eq("user_id", user.id).eq("exam_id", exam.id).maybeSingle();
    if (accessError) throw accessError;
    if (access) return NextResponse.json({ error: "You already own this exam" }, { status: 409 });

    const callbackUrl = new URL("/api/payments/verify", request.url).toString();
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        amount: exam.price_kobo,
        currency: "NGN",
        callback_url: callbackUrl,
        metadata: { exam_slug: slug, user_id: user.id },
      }),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok || !data?.status || !data.data?.authorization_url) {
      return NextResponse.json({ error: "Unable to start secure checkout" }, { status: 502 });
    }
    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch {
    return NextResponse.json({ error: "Could not initialize payment" }, { status: 500 });
  }
}
