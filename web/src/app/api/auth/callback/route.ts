import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { safeAuthRedirect } from "@/lib/auth-routing";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeAuthRedirect(searchParams.get("next"));
  const failed = new URL("/login", origin);
  failed.searchParams.set("error", "auth_callback_failed");
  failed.searchParams.set("redirect", next);

  if (code && !searchParams.has("error")) {
    try {
      const supabase = await createServerSupabase();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (user && !userError) {
          let destination = new URL(next, origin);
          if (!user.user_metadata?.onboarding_completed) {
            destination = new URL("/onboarding", origin);
            destination.searchParams.set("next", next);
          } else if (next === "/dashboard") {
            const { data: profile, error: profileError } = await supabase
              .from("users")
              .select("role")
              .eq("id", user.id)
              .single();
            if (profileError) return NextResponse.redirect(failed);
            if (profile.role === "parent") destination = new URL("/parent", origin);
          }
          const response = NextResponse.redirect(destination);
          response.headers.set("Cache-Control", "private, no-store");
          return response;
        }
      }
    } catch {
      // Auth details and provider error messages must not leak into redirect URLs.
    }
  }

  const response = NextResponse.redirect(failed);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
