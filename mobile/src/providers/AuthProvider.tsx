import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AppState, Platform } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
interface AuthState {
  session: Session | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}
const AuthContext = createContext<AuthState | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const userId = useRef<string | undefined>(undefined);
  useEffect(() => {
    const client = supabase;
    if (!client) {
      setLoading(false);
      return;
    }
    let active = true;
    let authEventReceived = false;
    setLoading(true);
    setError(null);
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, next) => {
      authEventReceived = true;
      if (!active) return;
      if (userId.current !== next?.user.id) queryClient.clear();
      userId.current = next?.user.id;
      setSession(next);
      setError(null);
      setLoading(false);
    });
    client.auth
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (!active || authEventReceived) return;
        setSession(data.session);
        setError(
          sessionError
            ? "We couldn't restore your session. Check your connection and try again."
            : null,
        );
        setLoading(false);
      })
      .catch(() => {
        if (active && !authEventReceived) {
          setError("Your saved session couldn't be loaded securely. Try again.");
          setLoading(false);
        }
      });
    const refresh = (state: string) =>
      state === "active" ? client.auth.startAutoRefresh() : client.auth.stopAutoRefresh();
    const listener = Platform.OS === "web" ? null : AppState.addEventListener("change", refresh);
    if (Platform.OS !== "web") refresh(AppState.currentState);
    return () => {
      active = false;
      subscription.unsubscribe();
      listener?.remove();
      if (Platform.OS !== "web") client.auth.stopAutoRefresh();
    };
  }, [attempt, queryClient]);
  return (
    <AuthContext.Provider
      value={{ session, loading, error, retry: () => setAttempt((value) => value + 1) }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
