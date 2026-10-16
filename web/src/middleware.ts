import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { requiresAuthentication } from "./lib/auth-routing";

/**
 * Verify protected requests with Supabase, refreshing cookies in both directions.
 * API routes perform their own authorization and are deliberately excluded.
 */

export async function middleware(request: NextRequest) {
  if (!requiresAuthentication(request.nextUrl.pathname)) return NextResponse.next();

  let response = NextResponse.next({ request });
  response.headers.set("Cache-Control", "private, no-store");
  const login = request.nextUrl.clone();
  login.pathname = "/login";
  login.search = "";
  login.searchParams.set("redirect", `${request.nextUrl.pathname}${request.nextUrl.search}`);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    login.searchParams.set("error", "configuration");
    return NextResponse.redirect(login);
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        response.headers.set("Cache-Control", "private, no-store");
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  try {
    // getSession only decodes local cookies. getUser verifies them with Auth.
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (user && !error) return response;
    if (error && error.name !== "AuthSessionMissingError") {
      login.searchParams.set("error", "session_expired");
    }
  } catch {
    login.searchParams.set("error", "auth_unavailable");
  }

  const redirect = NextResponse.redirect(login);
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  redirect.headers.set("Cache-Control", "private, no-store");
  return redirect;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|api).*)"],
};
