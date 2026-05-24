import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Spacing, FontSize, BorderRadius } from "@/src/constants/theme";

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>P</Text>
          </View>
          <Text style={styles.appName}>PrepHQ</Text>
          <Text style={styles.tagline}>The headquarters of exam preparation</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={Colors.text.dark + "60"}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.text.dark + "60"}
            secureTextEntry
          />
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Log In</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google OAuth */}
        <TouchableOpacity style={styles.googleBtn}>
          <Text style={styles.googleBtnText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Sign up link */}
        <TouchableOpacity style={styles.signupLink}>
          <Text style={styles.signupText}>
            Don't have an account? <Text style={styles.signupBold}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  logo: {
    width: 56,
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.btn,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: FontSize.xxl,
    fontWeight: "700",
  },
  appName: {
    color: Colors.text.dark,
    fontSize: FontSize.xxxl,
    fontWeight: "700",
  },
  tagline: {
    color: Colors.text.dark + "99",
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  form: {
    gap: Spacing.md,
  },
  input: {
    backgroundColor: Colors.border.dark + "40",
    borderWidth: 1,
    borderColor: Colors.border.dark,
    borderRadius: BorderRadius.card,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    color: Colors.text.dark,
    fontSize: FontSize.md,
    minHeight: 44,
  },
  primaryBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.btn,
    paddingVertical: Spacing.md,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: FontSize.md,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.dark,
  },
  dividerText: {
    color: Colors.text.dark + "60",
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.sm,
  },
  googleBtn: {
    borderWidth: 1,
    borderColor: Colors.border.dark,
    borderRadius: BorderRadius.btn,
    paddingVertical: Spacing.md,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  googleBtnText: {
    color: Colors.text.dark,
    fontSize: FontSize.md,
    fontWeight: "500",
  },
  signupLink: {
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  signupText: {
    color: Colors.text.dark + "99",
    fontSize: FontSize.sm,
  },
  signupBold: {
    color: Colors.secondary,
    fontWeight: "600",
  },
});
