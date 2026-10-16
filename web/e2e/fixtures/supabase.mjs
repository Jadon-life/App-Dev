/**
 * Isolated, loopback-only Auth/PostgREST fixture. It never calls Supabase or reads
 * production credentials. The signing key below is deliberately test-only.
 * Run: node web/e2e/fixtures/supabase.mjs
 */
import { createServer } from "node:http";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const FIXTURE_SUPABASE_URL = "http://127.0.0.1:54329";
export const FIXTURE_ANON_KEY = "local-test-anon-key";
const TEST_SIGNING_KEY = "cryslearn-local-browser-fixture-only-not-a-production-key";
const profiles = new Map();

function base64url(value) {
  return Buffer.from(typeof value === "string" ? value : JSON.stringify(value)).toString(
    "base64url",
  );
}

function signedToken(user, expiresAt) {
  const unsigned = `${base64url({ alg: "HS256", typ: "JWT" })}.${base64url({
    sub: user.id,
    aud: "authenticated",
    role: "authenticated",
    email: user.email,
    iss: `${FIXTURE_SUPABASE_URL}/auth/v1`,
    exp: expiresAt,
    iat: Math.floor(Date.now() / 1000),
  })}`;
  return `${unsigned}.${createHmac("sha256", TEST_SIGNING_KEY).update(unsigned).digest("base64url")}`;
}

export function fixtureSession(namespace = "default") {
  const hex = createHash("sha256").update(namespace).digest("hex");
  const id = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
  const timestamp = "2026-01-01T00:00:00.000Z";
  const user = {
    id,
    aud: "authenticated",
    role: "authenticated",
    email: `student-${hex.slice(0, 8)}@example.invalid`,
    email_confirmed_at: timestamp,
    phone: "",
    confirmed_at: timestamp,
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: { full_name: "Ada Test" },
    identities: [],
    created_at: timestamp,
    updated_at: timestamp,
    is_anonymous: false,
  };
  const expiresAt = Math.floor(Date.now() / 1000) + 3600;
  return {
    access_token: signedToken(user, expiresAt),
    refresh_token: `local-refresh-${id}`,
    expires_in: 3600,
    expires_at: expiresAt,
    token_type: "bearer",
    user,
  };
}

/** Supabase SSR's default cookie name derives from the configured hostname. */
export function fixtureCookie(session, appURL = "http://127.0.0.1:3100") {
  return {
    name: "sb-127-auth-token",
    value: `base64-${base64url(session)}`,
    url: appURL,
    httpOnly: false,
    secure: false,
    sameSite: "Lax",
    expires: session.expires_at,
  };
}

function authenticatedUser(request) {
  const token = request.headers.authorization?.replace(/^Bearer /, "");
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const expected = createHmac("sha256", TEST_SIGNING_KEY)
    .update(`${parts[0]}.${parts[1]}`)
    .digest();
  let signature, payload, header;
  try {
    signature = Buffer.from(parts[2], "base64url");
    payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    header = JSON.parse(Buffer.from(parts[0], "base64url").toString());
  } catch {
    return null;
  }
  if (
    signature.length !== expected.length ||
    !timingSafeEqual(signature, expected) ||
    header.alg !== "HS256" ||
    payload.exp <= Date.now() / 1000 ||
    payload.aud !== "authenticated" ||
    typeof payload.sub !== "string" ||
    !/^[0-9a-f-]{36}$/.test(payload.sub)
  )
    return null;
  return {
    id: payload.sub,
    aud: "authenticated",
    role: "authenticated",
    email: payload.email,
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: { full_name: "Ada Test" },
    identities: [],
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };
}

function respond(response, status, data, headers = {}) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "http://127.0.0.1:3100",
    "access-control-allow-methods": "GET, HEAD, POST, PATCH, OPTIONS",
    "access-control-allow-headers":
      "authorization, apikey, content-type, x-client-info, prefer, range, accept-profile, content-profile, x-supabase-api-version",
    "access-control-expose-headers": "content-range",
    "cache-control": "no-store",
    ...headers,
  });
  response.end(data === null ? "" : JSON.stringify(data));
}

async function body(request) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes > 16384) throw new Error("Fixture body too large");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString() || "{}");
}

export function createFixtureServer() {
  return createServer(async (request, response) => {
    const url = new URL(request.url || "/", FIXTURE_SUPABASE_URL);
    if (request.method === "OPTIONS") return respond(response, 204, null);
    if (url.pathname === "/health")
      return respond(response, 200, { fixture: "cryslearn-local-only" });
    const user = authenticatedUser(request);
    if (!user)
      return respond(response, 401, {
        code: "bad_jwt",
        message: "Fixture token is missing, expired or invalid.",
      });
    if (url.pathname === "/auth/v1/user" && request.method === "GET")
      return respond(response, 200, user);
    if (url.pathname === "/auth/v1/logout" && request.method === "POST")
      return respond(response, 204, null);
    if (!url.pathname.startsWith("/rest/v1/"))
      return respond(response, 404, { message: "Unsupported fixture endpoint" });
    const table = url.pathname.slice("/rest/v1/".length);
    const single = request.headers.accept?.includes("application/vnd.pgrst.object+json");
    try {
      if (table === "users") {
        if (url.searchParams.get("id") !== `eq.${user.id}`)
          return respond(response, 403, {
            code: "42501",
            message: "Fixture only exposes the requesting user's profile.",
          });
        const profile = profiles.get(user.id) || {
          id: user.id,
          name: "Ada Test",
          email: user.email,
          role: "student",
          linked_student_id: null,
          created_at: user.created_at,
        };
        if (request.method === "PATCH") {
          const updates = await body(request);
          if (Object.keys(updates).some((key) => !["name", "role"].includes(key)))
            return respond(response, 403, { code: "42501", message: "Unsupported fixture update" });
          if (
            updates.name !== undefined &&
            (typeof updates.name !== "string" || !updates.name.trim() || updates.name.length > 100)
          )
            return respond(response, 400, { message: "Invalid profile name" });
          Object.assign(profile, updates);
          profiles.set(user.id, profile);
        } else if (request.method !== "GET")
          return respond(response, 405, { message: "Unsupported fixture method" });
        return respond(response, 200, single ? profile : [profile], { "content-range": "0-0/1" });
      }
      if (table === "mock_attempts" || table === "user_exam_access") {
        if (request.method !== "GET" || url.searchParams.get("user_id") !== `eq.${user.id}`)
          return respond(response, 403, {
            code: "42501",
            message: "Fixture denies cross-account access.",
          });
        return respond(response, 200, [], { "content-range": "*/0" });
      }
      if (table === "exams" && request.method === "GET") {
        const exams = [
          {
            id: "10000000-0000-4000-a000-000000000001",
            slug: "jamb",
            name: "UTME",
            price_kobo: 350000,
            is_active: true,
          },
          {
            id: "10000000-0000-4000-a000-000000000002",
            slug: "waec",
            name: "WAEC",
            price_kobo: 350000,
            is_active: true,
          },
        ].filter(
          (exam) =>
            !url.searchParams.has("slug") || url.searchParams.get("slug") === `eq.${exam.slug}`,
        );
        return respond(response, 200, single ? (exams[0] ?? null) : exams, {
          "content-range": exams.length ? `0-${exams.length - 1}/${exams.length}` : "*/0",
        });
      }
      return respond(response, 404, { message: "Unsupported fixture table" });
    } catch {
      return respond(response, 400, { message: "Invalid fixture request" });
    }
  });
}

// Avoid import.meta here: Playwright loads helpers through its CommonJS transform.
if (process.argv[1] && /(?:^|\/)e2e\/fixtures\/supabase\.mjs$/.test(process.argv[1])) {
  const server = createFixtureServer();
  server.listen(54329, "127.0.0.1", () =>
    process.stdout.write(`Local Supabase fixture ready at ${FIXTURE_SUPABASE_URL}\n`),
  );
  process.once("SIGTERM", () => server.close());
  process.once("SIGINT", () => server.close());
}
