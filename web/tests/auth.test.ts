import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import {
  authErrorMessage,
  requiresAuthentication,
  safeAuthRedirect,
} from "../src/lib/auth-routing";
import { middleware } from "../src/middleware";

test("auth redirects preserve local destinations and reject external or encoded escapes", () => {
  assert.equal(
    safeAuthRedirect("/exams/jamb/mock?subjects=English#start"),
    "/exams/jamb/mock?subjects=English#start",
  );
  assert.equal(safeAuthRedirect(null, "/parent"), "/parent");
  for (const unsafe of [
    "https://evil.example",
    "javascript:alert(1)",
    "//evil.example",
    "/\\evil.example",
    "/%5cevil.example",
    "/%2f%2fevil.example",
    "/%252f%252fevil.example",
    "/path\n",
    "/%0apath",
    "/login",
    "/../login",
    "/%6cogin",
    "/api/auth/callback",
    "/%invalid",
  ]) {
    assert.equal(safeAuthRedirect(unsafe), "/dashboard", unsafe);
  }
});

test("every private section is protected without blocking similarly named public paths", () => {
  for (const path of [
    "/dashboard",
    "/exams",
    "/exams/jamb/mock",
    "/past-questions",
    "/parent",
    "/schedule",
    "/offline",
    "/settings",
    "/chat",
    "/pay/waec",
    "/onboarding",
    "/%64ashboard",
    "/exams%2fjamb/mock",
  ]) {
    assert.equal(requiresAuthentication(path), true, path);
  }
  for (const path of ["/", "/home", "/login", "/api/health", "/settings-public", "/examstuff"]) {
    assert.equal(requiresAuthentication(path), false, path);
  }
});

test("auth errors retain useful SDK messages without assuming thrown values are Errors", () => {
  assert.equal(
    authErrorMessage({ message: "Email not confirmed" }, "Try again"),
    "Email not confirmed",
  );
  assert.equal(
    authErrorMessage(new Error("Network unavailable"), "Try again"),
    "Network unavailable",
  );
  assert.equal(authErrorMessage(undefined, "Try again"), "Try again");
  assert.equal(authErrorMessage({ message: 42 }, "Try again"), "Try again");
});

test("middleware leaves public pages accessible and redirects anonymous private requests", async () => {
  const publicResponse = await middleware(new NextRequest("https://cryslearn.example/home"));
  assert.equal(publicResponse.status, 200);
  const privateResponse = await middleware(
    new NextRequest("https://cryslearn.example/exams/jamb/mock?subjects=English"),
  );
  const destination = new URL(privateResponse.headers.get("location")!);
  assert.equal(privateResponse.status, 307);
  assert.equal(destination.pathname, "/login");
  assert.equal(destination.searchParams.get("redirect"), "/exams/jamb/mock?subjects=English");
  assert.match(privateResponse.headers.get("cache-control")!, /no-store/);
});

test("middleware verifies cookie sessions against Auth rather than trusting embedded user data", async () => {
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const originalFetch = globalThis.fetch;
  let authRequests = 0;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://auth-test.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anonymous-key";
  globalThis.fetch = async (input) => {
    assert.match(String(input), /auth-test\.supabase\.co\/auth\/v1\/user/);
    authRequests += 1;
    return new Response(JSON.stringify({ code: "bad_jwt", message: "Invalid JWT" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  };
  try {
    const payload = Buffer.from(
      JSON.stringify({ sub: "forged-user", exp: Math.floor(Date.now() / 1000) + 3600 }),
    ).toString("base64url");
    const accessToken = `${Buffer.from('{"alg":"HS256","typ":"JWT"}').toString("base64url")}.${payload}.untrusted-signature`;
    const session = {
      access_token: accessToken,
      refresh_token: "fake-refresh",
      token_type: "bearer",
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      user: { id: "forged-user" },
    };
    const cookie = `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`;
    const request = new NextRequest("https://cryslearn.example/dashboard", {
      headers: { cookie: `sb-auth-test-auth-token=${cookie}` },
    });
    const response = await middleware(request);
    assert.equal(authRequests, 1);
    assert.equal(response.status, 307);
    assert.equal(new URL(response.headers.get("location")!).pathname, "/login");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    if (originalKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
  }
});
