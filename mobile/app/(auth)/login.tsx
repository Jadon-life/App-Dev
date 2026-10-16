import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { Redirect } from "expo-router";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { securePkceAvailable, supabase } from "../../src/lib/supabase";
import { openWeb } from "../../src/lib/web-link";
import { completeOAuthCode } from "../../src/lib/oauth";
import { useAuth } from "../../src/providers/AuthProvider";
import { Button, Field, Heading, Loading, Notice, Screen, ui } from "../../src/components/ui";
WebBrowser.maybeCompleteAuthSession();
export default function LoginScreen() {
  const { session, loading, error: sessionError, retry } = useAuth();
  const [signup, setSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const submitting = useRef(false);
  if (loading) return <Loading />;
  if (session) return <Redirect href="/(tabs)" />;
  async function submit() {
    if (!supabase || submitting.current) return;
    setError("");
    setMessage("");
    const address = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!password || (signup && password.length < 8)) {
      setError(signup ? "Choose a password with at least 8 characters." : "Enter your password.");
      return;
    }
    submitting.current = true;
    setBusy(true);
    try {
      const result = signup
        ? await supabase.auth.signUp({ email: address, password })
        : await supabase.auth.signInWithPassword({ email: address, password });
      if (result.error) throw result.error;
      if (signup && !result.data.session) {
        setMessage("Check your email to confirm your account, then return here to sign in.");
        setSignup(false);
        setPassword("");
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "We couldn't sign you in. Check your connection and try again.",
      );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  async function signInWithGoogle() {
    if (!supabase || submitting.current) return;
    if (!securePkceAvailable) {
      setError("");
      setMessage(
        "Google sign-in opens the website. To sign in on this device, use your email and password.",
      );
      await openWeb("/login");
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const redirectTo = makeRedirectUri({ scheme: "cryslearn", path: "auth/callback" });
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (oauthError) throw oauthError;
      if (!data.url) throw new Error("Google sign-in is unavailable. Try your email and password.");
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type !== "success") {
        setMessage("Google sign-in was cancelled. You can try again when you're ready.");
        return;
      }
      const callback = new URL(result.url);
      const code = callback.searchParams.get("code");
      if (!code)
        throw new Error(
          "Google sign-in didn't complete. Try again or use your email and password.",
        );
      await completeOAuthCode(code);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Google sign-in couldn't connect. Try again.",
      );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Screen>
        <View style={{ marginTop: 24, gap: 16 }}>
          <Text style={ui.eyebrow}>CrysLearn / Your study desk</Text>
          <Heading
            title={signup ? "A clearer path starts here." : "Make room for your next breakthrough."}
            description="Focused practice for UTME and WAEC. Your learning, one considered step at a time."
          />
        </View>
        <View style={[ui.card, { gap: 20 }]}>
          <Text accessibilityRole="header" style={ui.heading}>
            {signup ? "Create your account" : "Welcome back"}
          </Text>
          <Field
            label="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!busy}
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete={signup ? "new-password" : "current-password"}
            editable={!busy}
            onSubmitEditing={() => {
              void submit();
            }}
            returnKeyType="go"
          />
          {signup && <Text style={ui.small}>Use at least 8 characters.</Text>}
          {error && <Notice error message={error} />}
          {message && <Notice message={message} />}
          {sessionError && (
            <>
              <Notice error message={sessionError} />
              <Button title="Retry saved session" secondary onPress={retry} />
            </>
          )}
          <Button
            title={signup ? "Create account" : "Sign in"}
            busy={busy}
            onPress={() => {
              void submit();
            }}
          />
        </View>
        <Button
          title={securePkceAvailable ? "Continue with Google" : "Continue with Google on the web"}
          secondary
          disabled={busy}
          onPress={() => {
            void signInWithGoogle();
          }}
        />
        <Button
          title={
            signup ? "Already have an account? Sign in" : "New to CrysLearn? Create an account"
          }
          secondary
          disabled={busy}
          onPress={() => {
            setSignup(!signup);
            setError("");
            setMessage("");
          }}
        />
        <Text style={ui.small}>Your account works across mobile and the CrysLearn website.</Text>
      </Screen>
    </KeyboardAvoidingView>
  );
}
