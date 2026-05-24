import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Spacing, FontSize, BorderRadius } from "@/src/constants/theme";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back 👋</Text>
          <Text style={styles.title}>Your Dashboard</Text>
        </View>

        {/* Empty State — per Document 03 */}
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>Your learning journey begins here</Text>
          <Text style={styles.emptyDescription}>
            Pick your first exam to get started.
          </Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaText}>Browse Exams</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  greeting: {
    color: Colors.text.dark + "99",
    fontSize: FontSize.sm,
  },
  title: {
    color: Colors.text.dark,
    fontSize: FontSize.xxl,
    fontWeight: "700",
    marginTop: Spacing.xs,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: Spacing.xxl * 2,
    paddingHorizontal: Spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    color: Colors.text.dark,
    fontSize: FontSize.lg,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyDescription: {
    color: Colors.text.dark + "99",
    fontSize: FontSize.md,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
  ctaButton: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.btn,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
    minHeight: 44,
    justifyContent: "center",
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: FontSize.md,
    fontWeight: "600",
  },
});
