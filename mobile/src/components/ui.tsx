import type { ReactNode } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, MIN_TOUCH_TARGET } from "../constants/theme";
export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background.dark },
  content: {
    padding: 24,
    paddingBottom: 40,
    gap: 24,
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    flexGrow: 1,
  },
  eyebrow: {
    color: Colors.secondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  title: {
    color: Colors.text.dark,
    fontSize: 32,
    lineHeight: 39,
    fontWeight: "700",
    letterSpacing: -0.8,
  },
  heading: { color: Colors.text.dark, fontSize: 20, lineHeight: 27, fontWeight: "600" },
  body: { color: Colors.text.muted, fontSize: 16, lineHeight: 24 },
  label: { color: Colors.text.dark, fontSize: 14, fontWeight: "600" },
  card: { padding: 22, borderRadius: 16, backgroundColor: Colors.surface.dark, gap: 12 },
  rule: { height: 1, backgroundColor: Colors.border.dark },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 },
  small: { color: Colors.text.muted, fontSize: 13, lineHeight: 20 },
  input: {
    borderWidth: 1,
    borderColor: Colors.border.dark,
    backgroundColor: Colors.surface.dark,
    borderRadius: 12,
    color: Colors.text.dark,
    padding: 16,
    fontSize: 16,
    minHeight: MIN_TOUCH_TARGET,
  },
  button: {
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.secondary,
  },
  buttonText: {
    color: Colors.background.dark,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  secondary: { backgroundColor: "transparent", borderWidth: 1, borderColor: Colors.border.dark },
  secondaryText: { color: Colors.text.dark },
  notice: { borderLeftWidth: 3, borderLeftColor: Colors.secondary, paddingLeft: 16, gap: 8 },
  error: { color: Colors.danger, fontSize: 15, lineHeight: 22 },
});
export function Screen({
  children,
  refreshControl,
}: {
  children: ReactNode;
  refreshControl?: React.ReactElement;
}) {
  return (
    <SafeAreaView style={ui.screen} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={ui.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={refreshControl}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
export function Heading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <View style={{ gap: 10 }}>
      {eyebrow && <Text style={ui.eyebrow}>{eyebrow}</Text>}
      <Text accessibilityRole="header" style={ui.title}>
        {title}
      </Text>
      {description && <Text style={ui.body}>{description}</Text>}
    </View>
  );
}
export function Button({
  title,
  onPress,
  busy = false,
  disabled = false,
  secondary = false,
}: {
  title: string;
  onPress: () => void;
  busy?: boolean;
  disabled?: boolean;
  secondary?: boolean;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || busy, busy }}
      disabled={disabled || busy}
      onPress={onPress}
      style={[ui.button, secondary && ui.secondary, (disabled || busy) && { opacity: 0.55 }]}
    >
      {busy ? (
        <ActivityIndicator
          color={secondary ? Colors.text.dark : Colors.background.dark}
          accessibilityLabel="Please wait"
        />
      ) : (
        <Text style={[ui.buttonText, secondary && ui.secondaryText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={ui.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={Colors.text.muted}
        style={ui.input}
        {...props}
      />
    </View>
  );
}
export function Notice({ message, error = false }: { message: string; error?: boolean }) {
  return (
    <Text
      accessibilityRole={error ? "alert" : "text"}
      accessibilityLiveRegion="polite"
      style={error ? ui.error : ui.body}
    >
      {message}
    </Text>
  );
}
export function Loading() {
  return (
    <SafeAreaView style={[ui.screen, { alignItems: "center", justifyContent: "center", gap: 16 }]}>
      <ActivityIndicator size="large" color={Colors.secondary} />
      <Text style={ui.body}>Opening your study desk…</Text>
    </SafeAreaView>
  );
}
