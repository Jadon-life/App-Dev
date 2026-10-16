import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { verifyAndGrantExamAccess } from "@/lib/payments";

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: "Payment provider unavailable" }, { status: 503 });
  const body = await request.text();
  const supplied = request.headers.get("x-paystack-signature") || "";
  const expected = createHmac("sha512", secret).update(body).digest("hex");
  const valid = /^[0-9a-f]{128}$/i.test(supplied) &&
    timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(supplied, "hex"));
  if (!valid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  let event: { event?: string; data?: { reference?: string } };
  try { event = JSON.parse(body); }
  catch { return NextResponse.json({ error: "Invalid event" }, { status: 400 }); }
  if (event.event !== "charge.success") return NextResponse.json({ received: true });
  const reference = event.data?.reference;
  if (!reference) return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  try {
    await verifyAndGrantExamAccess(reference);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Payment webhook rejected:", error);
    // Let Paystack retry transient failures. Never acknowledge an unsuccessful grant.
    return NextResponse.json({ error: "Unable to verify or record payment" }, { status: 503 });
  }
}
