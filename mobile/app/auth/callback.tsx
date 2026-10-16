import { useEffect, useState } from "react";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { supabase } from "../../src/lib/supabase";
import { completeOAuthCode } from "../../src/lib/oauth";
import { useAuth } from "../../src/providers/AuthProvider";
import { Button, Heading, Loading, Screen } from "../../src/components/ui";
// Handles the callback if the OS launches a fresh app process during OAuth.
export default function AuthCallback() {
  const { code, error: callbackError } = useLocalSearchParams<{ code?: string; error?: string }>();
  const { session, loading } = useAuth();
  const [error, setError] = useState("");
  useEffect(() => {
    if (loading || session) return;
    if (callbackError || typeof code !== "string" || !code || !supabase) {
      setError("Sign-in didn't complete. Please try again.");
      return;
    }
    let active = true;
    completeOAuthCode(code).catch(() => {
      if (active) setError("Sign-in couldn't connect. Please return to sign in and try again.");
    });
    return () => {
      active = false;
    };
  }, [code, callbackError, loading, session]);
  if (session) return <Redirect href="/(tabs)" />;
  if (!error) return <Loading />;
  return (
    <Screen>
      <Heading title="Let's try that again" description={error} />
      <Button title="Return to sign in" onPress={() => router.replace("/(auth)/login")} />
    </Screen>
  );
}
