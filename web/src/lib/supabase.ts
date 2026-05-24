import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser-side Supabase client (used in Client Components)
 * Uses the anon key — RLS policies apply
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Server-side Supabase client (used in API routes / Server Actions)
 * Uses the service role key — bypasses RLS (admin operations only)
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
