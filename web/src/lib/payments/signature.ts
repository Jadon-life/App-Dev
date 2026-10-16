import { createHmac, timingSafeEqual } from "node:crypto";

export function hasValidPaystackSignature(
  body: string,
  signature: string | null,
  secret: string,
): boolean {
  if (!signature || !/^[a-f0-9]{128}$/i.test(signature) || !secret) return false;
  const expected = createHmac("sha512", secret).update(body).digest();
  const supplied = Buffer.from(signature, "hex");
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}
