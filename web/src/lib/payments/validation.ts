import { EXAMS } from "@shared/constants/exams";
import type { ExamSlug } from "@/types/database";

export class PaymentValidationError extends Error {}

export function isExamSlug(value: unknown): value is ExamSlug {
  return typeof value === "string" && Object.hasOwn(EXAMS, value);
}

export function isPaymentReference(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value !== "." &&
    value !== ".." &&
    /^[A-Za-z0-9._=-]{1,200}$/.test(value)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export interface VerifiedPayment {
  reference: string;
  examSlug: ExamSlug;
  userId: string;
  amount: number;
  currency: "NGN";
}

/** Validate both callback and signed webhook data before granting any access. */
export function validatePayment(
  value: unknown,
  expected: { reference?: string; userId?: string } = {},
): VerifiedPayment {
  if (!isRecord(value) || value.status !== "success" || !isPaymentReference(value.reference)) {
    throw new PaymentValidationError("The payment has not been completed.");
  }

  if (expected.reference && value.reference !== expected.reference) {
    throw new PaymentValidationError("The payment reference does not match.");
  }

  let metadata: unknown = value.metadata;
  if (typeof metadata === "string") {
    try {
      metadata = JSON.parse(metadata);
    } catch {
      throw new PaymentValidationError("The payment details are invalid.");
    }
  }

  if (
    !isRecord(metadata) ||
    !isExamSlug(metadata.exam_slug) ||
    typeof metadata.user_id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(metadata.user_id)
  ) {
    throw new PaymentValidationError("The payment details are invalid.");
  }

  if (expected.userId && metadata.user_id !== expected.userId) {
    throw new PaymentValidationError("This payment belongs to another account.");
  }

  if (
    !Number.isSafeInteger(value.amount) ||
    value.amount !== EXAMS[metadata.exam_slug].price_kobo ||
    value.currency !== "NGN"
  ) {
    throw new PaymentValidationError("The payment amount or currency does not match this exam.");
  }

  return {
    reference: value.reference,
    examSlug: metadata.exam_slug,
    userId: metadata.user_id,
    amount: value.amount as number,
    currency: "NGN",
  };
}

export function getApplicationOrigin(
  requestUrl: string,
  configuration: { NEXT_PUBLIC_APP_URL?: string } = {},
): string {
  const configured = configuration.NEXT_PUBLIC_APP_URL?.trim();
  // Keep the visitor's host by default so custom-domain authentication cookies survive the callback.
  const source = configured || requestUrl;
  const url = new URL(source);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (
    url.username ||
    url.password ||
    (url.protocol !== "https:" && !(local && url.protocol === "http:"))
  ) {
    throw new Error("Configure a valid application URL for payment callbacks.");
  }
  return url.origin;
}

export function isPaystackCheckoutUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "checkout.paystack.com" &&
      !url.port &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
