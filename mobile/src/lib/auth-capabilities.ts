// Supabase's PKCE helper otherwise falls back to Math.random/plain challenges.
// Require secure random values and S256 support before initiating this flow.
export function supportsSecurePkce(crypto: unknown, textEncoder: unknown): boolean {
  if (!crypto || typeof crypto !== "object" || typeof textEncoder !== "function") return false;
  const candidate = crypto as { getRandomValues?: unknown; subtle?: { digest?: unknown } };
  return (
    typeof candidate.getRandomValues === "function" &&
    typeof candidate.subtle?.digest === "function"
  );
}
export function authFlowForCapabilities(securePkce: boolean): "pkce" | "implicit" {
  // Password auth + email confirmation work without PKCE. In this mode users
  // confirm their email and return to sign in; no URL tokens are consumed.
  return securePkce ? "pkce" : "implicit";
}
