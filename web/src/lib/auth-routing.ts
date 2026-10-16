function hasUnsafeCharacters(value: string): boolean {
  return Array.from(value).some(
    (character) =>
      character === "\\" || character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
  );
}

/** Accept only same-site paths, including when a redirect has been URL encoded. */
export function safeAuthRedirect(
  value: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;

  let decoded = value;
  try {
    for (let depth = 0; depth < 3; depth += 1) {
      if (hasUnsafeCharacters(decoded) || decoded.startsWith("//")) return fallback;
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
    if (hasUnsafeCharacters(decoded) || decoded.startsWith("//")) return fallback;
    const destination = new URL(value, "https://cryslearn.invalid");
    if (destination.origin !== "https://cryslearn.invalid") return fallback;
    const decodedDestination = new URL(decoded, "https://cryslearn.invalid");
    if (
      [destination.pathname, decodedDestination.pathname].some((path) =>
        ["/login", "/api/auth/callback"].includes(path),
      )
    )
      return fallback;
    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return fallback;
  }
}

const protectedPaths = [
  "/dashboard",
  "/exams",
  "/past-questions",
  "/parent",
  "/schedule",
  "/offline",
  "/settings",
  "/chat",
  "/pay",
  "/onboarding",
];

export function requiresAuthentication(pathname: string): boolean {
  // Route segments may be decoded after middleware; their spelling must not
  // decide whether a private page requires a verified session.
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    // An invalid encoding does not identify a valid application route.
  }
  return protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function authErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return fallback;
}
