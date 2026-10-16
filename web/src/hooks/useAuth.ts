"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { isSupabaseConfigured, requireSupabaseConfiguration, supabase } from "@/lib/supabase";
import { authErrorMessage, safeAuthRedirect } from "@/lib/auth-routing";
import type {
  AuthResponse,
  AuthTokenResponsePassword,
  OAuthResponse,
  User,
  Session,
} from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<AuthTokenResponsePassword["data"]>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<AuthResponse["data"]>;
  signInWithGoogle: (redirect?: string) => Promise<OAuthResponse["data"]>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** One subscription for the app, so consumers share the same session state. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });
  const previousUserId = useRef<string | null | undefined>(undefined);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    let active = true;
    let authRevision = 0;

    const applySession = (session: Session | null, error: string | null = null) => {
      if (!active) return;
      const userId = session?.user.id ?? null;
      if (previousUserId.current !== undefined && previousUserId.current !== userId) {
        // Do not leave another account's results or profile in the query cache.
        queryClient.clear();
      }
      previousUserId.current = userId;
      setState({ user: session?.user ?? null, session, loading: false, error });
    };

    if (!isSupabaseConfigured) {
      applySession(
        null,
        "Sign-in is not configured yet. Please try again once the service is available.",
      );
      return () => {
        active = false;
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      authRevision += 1;
      applySession(session);
    });

    const initialRevision = authRevision;
    void supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        // A sign-in/sign-out that happens during startup must win over old data.
        if (authRevision === initialRevision) {
          applySession(
            session,
            error ? authErrorMessage(error, "Your session could not be loaded.") : null,
          );
        }
      })
      .catch((error: unknown) => {
        if (authRevision === initialRevision)
          applySession(null, authErrorMessage(error, "Your session could not be loaded."));
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    requireSupabaseConfiguration();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw error;
    return data;
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, name: string) => {
    requireSupabaseConfiguration();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/onboarding`,
      },
    });
    if (error) throw error;
    return data;
  }, []);

  const signInWithGoogle = useCallback(async (redirect = "/dashboard") => {
    requireSupabaseConfiguration();
    const callback = new URL("/api/auth/callback", window.location.origin);
    callback.searchParams.set("next", safeAuthRedirect(redirect));
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callback.toString() },
    });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    queryClient.clear();
    router.replace("/");
    router.refresh();
  }, [queryClient, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      isAuthenticated: Boolean(state.session),
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
    }),
    [state, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}
