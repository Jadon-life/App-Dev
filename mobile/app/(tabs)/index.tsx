import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button, Heading, Screen, ui } from "../../src/components/ui";
import { useProfile } from "../../src/lib/study-data";
export default function HomeScreen() {
  const { data: profile } = useProfile();
  const parent = profile?.role === "parent";
  return (
    <Screen>
      <Heading
        eyebrow="CrysLearn / Study desk"
        title={`Welcome, ${profile?.name?.split(" ")[0] || "learner"}.`}
        description={
          parent
            ? "A little encouragement can make a big difference."
            : "Give your next exam a little focus today."
        }
      />
      <View style={[ui.card, { paddingVertical: 32, gap: 20 }]}>
        <Text style={ui.eyebrow}>
          {parent ? "Support their next chapter" : "One step at a time"}
        </Text>
        <Text accessibilityRole="header" style={ui.title}>
          {parent ? "Encouragement starts with trust." : "Preparation begins with practice."}
        </Text>
        <Text style={ui.body}>
          {parent
            ? "Student progress stays private. Parent sharing will need student-approved access before results can be shown."
            : "Find your exam, check your access, and continue your practice on the web."}
        </Text>
        <Button
          title={parent ? "About parent access" : "Explore exams"}
          onPress={() => router.push(parent ? "/(tabs)/progress" : "/(tabs)/exams")}
        />
      </View>
      <View style={ui.notice}>
        <Text style={ui.heading}>Your account travels with you.</Text>
        <Text style={ui.body}>
          The mobile study desk keeps your profile, exam access, and completed attempts in sync.
          Practice sessions and payments currently open on the CrysLearn website.
        </Text>
        <Text style={ui.small}>You may need to sign in again in your browser.</Text>
      </View>
      <View style={ui.rule} />
      <Button
        title="View learning profile"
        secondary
        onPress={() => router.push("/(tabs)/settings")}
      />
    </Screen>
  );
}
