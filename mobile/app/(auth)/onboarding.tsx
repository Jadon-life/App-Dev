import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Spacing, FontSize, BorderRadius } from "@/src/constants/theme";

const examOptions = [
  { slug: "jamb", name: "JAMB", description: "UTME" },
  { slug: "waec", name: "WAEC", description: "SSCE" },
  { slug: "neco", name: "NECO", description: "SSCE" },
  { slug: "post-utme", name: "Post-UTME", description: "University Screening" },
];

const roles = [
  { id: "student", label: "I am a Student", emoji: "🎓" },
  { id: "parent", label: "I am a Parent", emoji: "👨‍👩‍👦" },
];

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Let's set you up</Text>
        <Text style={styles.subtitle}>
          Tell us about yourself so we can personalise your experience.
        </Text>

        {/* Role Selection */}
        <Text style={styles.sectionTitle}>I am a...</Text>
        <View style={styles.roleGrid}>
          {roles.map((role) => (
            <TouchableOpacity key={role.id} style={styles.roleCard}>
              <Text style={styles.roleEmoji}>{role.emoji}</Text>
              <Text style={styles.roleLabel}>{role.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Exam Selection */}
        <Text style={styles.sectionTitle}>Which exam(s) are you preparing for?</Text>
        <View style={styles.examGrid}>
          {examOptions.map((exam) => (
            <TouchableOpacity key={exam.slug} style={styles.examCard}>
              <Text style={styles.examName}>{exam.name}</Text>
              <Text style={styles.examDesc}>{exam.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue */}
        <TouchableOpacity style={styles.continueBtn}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },
  title: {
    color: Colors.text.dark,
    fontSize: FontSize.xxl,
    fontWeight: "700",
  },
  subtitle: {
    color: Colors.text.dark + "99",
    fontSize: FontSize.md,
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  sectionTitle: {
    color: Colors.text.dark,
    fontSize: FontSize.md,
    fontWeight: "600",
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  roleGrid: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  roleCard: {
    flex: 1,
    backgroundColor: Colors.border.dark + "40",
    borderWidth: 1,
    borderColor: Colors.border.dark,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.sm,
    minHeight: 44,
  },
  roleEmoji: {
    fontSize: 28,
  },
  roleLabel: {
    color: Colors.text.dark,
    fontSize: FontSize.sm,
    fontWeight: "500",
  },
  examGrid: {
    gap: Spacing.md,
  },
  examCard: {
    backgroundColor: Colors.border.dark + "40",
    borderWidth: 1,
    borderColor: Colors.border.dark,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    minHeight: 44,
  },
  examName: {
    color: Colors.text.dark,
    fontSize: FontSize.lg,
    fontWeight: "600",
  },
  examDesc: {
    color: Colors.text.dark + "99",
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  continueBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.btn,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.xxl,
    minHeight: 44,
    justifyContent: "center",
  },
  continueBtnText: {
    color: "#FFFFFF",
    fontSize: FontSize.md,
    fontWeight: "600",
  },
});
