import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Spacing, FontSize, BorderRadius } from "@/src/constants/theme";

const examsList = [
  { slug: "jamb", name: "JAMB", description: "Unified Tertiary Matriculation Examination", price: "₦3,500" },
  { slug: "waec", name: "WAEC", description: "West African Senior School Certificate", price: "₦3,500" },
  { slug: "neco", name: "NECO", description: "National Examinations Council", price: "₦3,500" },
  { slug: "post-utme", name: "Post-UTME", description: "University Post-UTME Screening", price: "₦5,000" },
];

export default function ExamsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Exams</Text>
          <Text style={styles.subtitle}>Choose an exam to start preparing</Text>
        </View>

        <View style={styles.list}>
          {examsList.map((exam) => (
            <TouchableOpacity key={exam.slug} style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.examName}>{exam.name}</Text>
                <Text style={styles.examDescription}>{exam.description}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.price}>{exam.price}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Locked</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  list: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.background.dark + "AA",
    borderWidth: 1,
    borderColor: Colors.border.dark,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
  },
  cardContent: {
    gap: Spacing.sm,
  },
  examName: {
    color: Colors.text.dark,
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
  examDescription: {
    color: Colors.text.dark + "99",
    fontSize: FontSize.sm,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  price: {
    color: Colors.secondary,
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
  badge: {
    backgroundColor: Colors.warning + "20",
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  badgeText: {
    color: Colors.warning,
    fontSize: FontSize.xs,
    fontWeight: "600",
  },
});
