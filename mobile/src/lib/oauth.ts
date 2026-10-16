import { supabase } from "./supabase";
// A warm OAuth callback can reach both Expo's auth browser promise and its
// router. Exchange each one-time code once even when both receive that URL.
let pending: { code: string; result: Promise<void> } | null = null;
export function completeOAuthCode(code: string) {
  if (pending?.code === code) return pending.result;
  const result = (async () => {
    if (!supabase) throw new Error("Sign-in is unavailable in this build.");
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
  })();
  pending = { code, result };
  return result;
}
