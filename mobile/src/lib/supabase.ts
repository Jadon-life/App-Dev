import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { createSecureStorageAdapter } from "./secure-storage";
import { createBoundedFetch } from "./request";
import { authFlowForCapabilities, supportsSecurePkce } from "./auth-capabilities";
export const securePkceAvailable = supportsSecurePkce(globalThis.crypto, globalThis.TextEncoder);
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
function validUrl(value: string | undefined) {
  try {
    const parsed = new URL(value || "");
    return (
      ["http:", "https:"].includes(parsed.protocol) &&
      Boolean(parsed.hostname) &&
      !parsed.username &&
      !parsed.password
    );
  } catch {
    return false;
  }
}
export const configurationError =
  !validUrl(url) || !anonKey?.trim()
    ? "This mobile build needs its Supabase URL and public anon key. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY, then restart Expo."
    : null;
// SecureStore is native-only; the optional browser preview uses sessionStorage.
const browserStorage = {
  getItem: (key: string) =>
    typeof window === "undefined" ? null : window.sessionStorage.getItem(key),
  setItem: (key: string, value: string) => {
    if (typeof window !== "undefined") window.sessionStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (typeof window !== "undefined") window.sessionStorage.removeItem(key);
  },
};
export const supabase = configurationError
  ? null
  : createClient(url!, anonKey!, {
      global: { fetch: createBoundedFetch(fetch) },
      auth: {
        storage: Platform.OS === "web" ? browserStorage : createSecureStorageAdapter(SecureStore),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        flowType: authFlowForCapabilities(securePkceAvailable),
      },
    });
