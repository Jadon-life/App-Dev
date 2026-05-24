import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Spacing, FontSize, BorderRadius } from "@/src/constants/theme";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Storage</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>About CrysLearn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]}>
          <Text style={styles.logoutText}>Log Out</Text>
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
  section: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  menuItem: {
    backgroundColor: Colors.border.dark + "40",
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    minHeight: 44,
    justifyContent: "center",
  },
  menuText: {
    color: Colors.text.dark,
    fontSize: FontSize.md,
    fontWeight: "500",
  },
  logoutItem: {
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.danger + "40",
    backgroundColor: Colors.danger + "10",
  },
  logoutText: {
    color: Colors.danger,
    fontSize: FontSize.md,
    fontWeight: "600",
  },
});
