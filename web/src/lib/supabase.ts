import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Browser-side Supabase client (used in Client Components)
 * Cookie storage is shared with middleware and route handlers. The previous
 * localStorage-only client left authenticated browsers anonymous on the server.
 * Placeholders allow public pages to render without configuration; auth actions
 * explicitly reject that state instead of attempting requests to a fake project.
 */
export const supabase = createBrowserClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
);

export function requireSupabaseConfiguration() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Sign-in is not configured yet. Please try again once the service is available.",
    );
  }
}
