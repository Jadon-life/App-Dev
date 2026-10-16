import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { Alert, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Field, Heading, Notice, Screen, ui } from "../../src/components/ui";
import { useAuth } from "../../src/providers/AuthProvider";
import { useProfile } from "../../src/lib/study-data";
import { supabase } from "../../src/lib/supabase";
export default function SettingsScreen() {
  const { session } = useAuth();
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();
  const [name, setName] = useState(profile?.name || "");
  const [busy, setBusy] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const submitting = useRef(false);
  useEffect(() => {
    setName(profile?.name || "");
  }, [profile?.name]);
  async function saveName() {
    if (!supabase || !session || submitting.current) return;
    if (!name.trim() || name.trim().length > 100) {
      setError("Enter a name between 1 and 100 characters.");
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const { error: saveError } = await supabase
        .from("users")
        .update({ name: name.trim() })
        .eq("id", session.user.id)
        .select("id")
        .single();
      if (saveError) throw saveError;
      await queryClient.invalidateQueries({ queryKey: ["profile", session.user.id] });
      setMessage("Your name has been updated.");
    } catch {
      setError("Your changes couldn't be saved. Check your connection and try again.");
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  async function signOut() {
    if (!supabase || submitting.current) return;
    submitting.current = true;
    setLoggingOut(true);
    setError("");
    setMessage("");
    try {
      const { error: signOutError } = await supabase.auth.signOut({ scope: "local" });
      if (signOutError) throw signOutError;
    } catch {
      setError("We couldn't sign you out. Please try again.");
    } finally {
      submitting.current = false;
      setLoggingOut(false);
    }
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Screen>
        <Heading
          eyebrow="Your space"
          title="Learning, on your terms."
          description="Manage the profile used across your CrysLearn account."
        />
        <View style={ui.card}>
          <Text style={ui.eyebrow}>{profile?.role || "student"} account</Text>
          <Text selectable style={ui.body}>
            {session?.user.email}
          </Text>
          <Field
            label="Your name"
            value={name}
            onChangeText={setName}
            maxLength={100}
            autoComplete="name"
            editable={!busy && !loggingOut}
          />
          <Button
            title="Save name"
            busy={busy}
            disabled={loggingOut || name.trim() === profile?.name}
            onPress={() => {
              void saveName();
            }}
          />
          {error && <Notice error message={error} />}
          {message && <Notice message={message} />}
        </View>
        <Button
          title="Update learning profile"
          secondary
          disabled={busy || loggingOut}
          onPress={() => router.push("/(auth)/onboarding")}
        />
        <View style={ui.rule} />
        <Button
          title="About CrysLearn"
          secondary
          onPress={() =>
            Alert.alert(
              "CrysLearn",
              "Learn with clarity. Score with confidence.\n\nA focused study companion for UTME and WAEC preparation. Mobile version 1.0.0.",
            )
          }
        />
        <Button
          title="Sign out of this device"
          secondary
          busy={loggingOut}
          disabled={busy}
          onPress={() => {
            void signOut();
          }}
        />
        <Text style={ui.small}>
          Signing out removes this device's session. Your profile and saved results stay in your
          account.
        </Text>
      </Screen>
    </KeyboardAvoidingView>
  );
}
