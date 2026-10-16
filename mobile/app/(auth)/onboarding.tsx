import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from "react-native";
import { Redirect, router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../src/providers/AuthProvider";
import { useProfile } from "../../src/lib/study-data";
import { supabase } from "../../src/lib/supabase";
import { editableProfile } from "../../src/lib/profile-access";
import { Colors } from "../../src/constants/theme";
import { Button, Field, Heading, Loading, Notice, Screen, ui } from "../../src/components/ui";
export default function OnboardingScreen() {
  const { session, loading } = useAuth();
  const profile = useProfile();
  const client = useQueryClient();
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "parent">("student");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  useEffect(() => {
    if (profile.data) {
      setName(profile.data.name);
      setRole(profile.data.role);
    }
  }, [profile.data]);
  if (loading || (session && profile.isPending)) return <Loading />;
  if (!session) return <Redirect href="/(auth)/login" />;
  async function save() {
    if (!supabase || !session || submitting.current) return;
    if (!name.trim() || name.trim().length > 100) {
      setError("Enter a name between 1 and 100 characters.");
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError("");
    try {
      if (!profile.data)
        throw new Error(
          "Your account profile is unavailable. Please sign out and contact support before trying again.",
        );
      const { error: saveError } = await supabase
        .from("users")
        .update(editableProfile(name, role))
        .eq("id", session.user.id)
        .select("id")
        .single();
      if (saveError) throw saveError;
      await client.invalidateQueries({ queryKey: ["profile", session.user.id] });
      router.replace("/(tabs)");
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Your profile couldn't be saved. Check your connection and try again.",
      );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  async function signOut() {
    if (!supabase || submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError("");
    try {
      const { error: signOutError } = await supabase.auth.signOut({ scope: "local" });
      if (signOutError) throw signOutError;
    } catch {
      setError("We couldn't sign out. Check your connection and try again.");
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
        <Heading
          eyebrow="A good place to begin"
          title="Make this space yours."
          description="Tell us what to call you and how you'll use CrysLearn."
        />
        {profile.isError ? (
          <>
            <Notice
              error
              message="We couldn't load your profile. Try again before making changes."
            />
            <Button
              title="Try again"
              onPress={() => {
                void profile.refetch();
              }}
            />
          </>
        ) : (
          <>
            <Field
              label="Your name"
              value={name}
              onChangeText={setName}
              maxLength={100}
              autoComplete="name"
              editable={!busy}
            />
            <Text style={ui.label}>I'm here as a</Text>
            <View style={{ gap: 12 }}>
              {(
                [
                  { id: "student", title: "Student", detail: "Prepare for your next exam." },
                  {
                    id: "parent",
                    title: "Parent",
                    detail: "Support a learner. Sharing is not available yet.",
                  },
                ] as const
              ).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: role === item.id, disabled: busy }}
                  disabled={busy}
                  onPress={() => setRole(item.id)}
                  style={[
                    ui.card,
                    {
                      borderWidth: 1,
                      borderColor: role === item.id ? Colors.secondary : Colors.border.dark,
                    },
                  ]}
                >
                  <Text style={ui.heading}>
                    {item.title}
                    {role === item.id ? "  ✓" : ""}
                  </Text>
                  <Text style={ui.body}>{item.detail}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button
              title="Open my study desk"
              busy={busy}
              onPress={() => {
                void save();
              }}
            />
          </>
        )}
        {error && <Notice error message={error} />}
        <Button
          title="Sign out"
          secondary
          disabled={busy}
          onPress={() => {
            void signOut();
          }}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}
