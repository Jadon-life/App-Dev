import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Spacing, FontSize } from "@/src/constants/theme";

export default function OfflineScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Offline</Text>
        <Text style={styles.subtitle}>Download packs for study without internet</Text>
      </View>

      {/* Empty State — per Document 03 */}
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📥</Text>
        <Text style={styles.emptyTitle}>No downloads yet</Text>
        <Text style={styles.emptyDescription}>
          Download question packs to study without internet.
        </Text>
      </View>
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
  title: {
    color: Colors.text.dark,
    fontSize: FontSize.xxl,
    fontWeight: "700",
  },
  subtitle: {
    color: Colors.text.dark + "99",
    fontSize: FontSize.sm,
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
  },
  emptyDescription: {
    color: Colors.text.dark + "99",
    fontSize: FontSize.md,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
});
