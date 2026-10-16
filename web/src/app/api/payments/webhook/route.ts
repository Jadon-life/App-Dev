import { NextResponse } from "next/server";
import { getPaystackSecret, grantExamAccess } from "@/lib/payments/server";
import { hasValidPaystackSignature } from "@/lib/payments/signature";
import { PaymentValidationError, validatePayment } from "@/lib/payments/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    if (
      !hasValidPaystackSignature(
        body,
        request.headers.get("x-paystack-signature"),
        getPaystackSecret(),
      )
    ) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    let event: unknown;
    try {
      event = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: "Invalid webhook body" }, { status: 400 });
    }
    if (!event || typeof event !== "object" || !("event" in event)) {
      return NextResponse.json({ error: "Invalid webhook event" }, { status: 400 });
    }
    if (event.event !== "charge.success") return NextResponse.json({ received: true });

    const payment = validatePayment("data" in event ? event.data : undefined);
    await grantExamAccess(payment);
    return NextResponse.json({
      received: true,
      status: "success",
      exam_unlocked: payment.examSlug,
    });
  } catch (error) {
    if (error instanceof PaymentValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    // Non-2xx is intentional: Paystack must retry a failed database write.
    console.error("Payment webhook could not complete exam access.");
    return NextResponse.json(
      { error: "Webhook processing is temporarily unavailable" },
      { status: 503 },
    );
  }
}
