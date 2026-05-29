import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware — TEMPORARILY DISABLED
 * 
 * Auth protection is disabled while we configure Supabase session cookies.
 * All routes are accessible without login for now.
 * We will re-enable this once the auth cookie flow is confirmed working.
 */

export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
