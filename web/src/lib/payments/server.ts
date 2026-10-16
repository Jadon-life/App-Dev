import "server-only";

import { createClient } from "@supabase/supabase-js";
import { validatePayment, type VerifiedPayment } from "./validation";
import { saveExamAccess } from "./access";

export function getPaystackSecret(): string {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !/^sk_(test|live)_/.test(secret)) {
    throw new Error("Payment service is not configured.");
  }
  return secret;
}

function createPaymentAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Payment fulfilment is not configured.");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

/** Fetch the authoritative transaction, rather than trusting browser query parameters. */
export async function verifyPaystackPayment(
  reference: string,
  userId?: string,
): Promise<VerifiedPayment> {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${getPaystackSecret()}` },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    },
  );
  if (!response.ok) throw new Error("Payment verification is temporarily unavailable.");
  const result: unknown = await response.json();
  if (
    !result ||
    typeof result !== "object" ||
    !("status" in result) ||
    result.status !== true ||
    !("data" in result)
  ) {
    throw new Error("Payment verification is temporarily unavailable.");
  }
  return validatePayment(result.data, { reference, userId });
}

/** The database's unique(user_id, exam_id) constraint makes callbacks and retries safe. */
export async function grantExamAccess(payment: VerifiedPayment): Promise<void> {
  await saveExamAccess(payment, createPaymentAdmin());
}
