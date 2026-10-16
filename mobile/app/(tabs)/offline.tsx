import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button, Heading, Screen, ui } from "../../src/components/ui";
export default function OfflineScreen() {
  return (
    <Screen>
      <Heading
        eyebrow="A note on availability"
        title="Keep your study desk connected."
        description="Offline question packs are not available in this mobile version yet."
      />
      <View style={ui.card}>
        <Text style={ui.heading}>Study online for now.</Text>
        <Text style={ui.body}>
          Exam practice currently runs on the CrysLearn website. Stay connected to load your exam
          access and sync completed attempts.
        </Text>
        <Button title="Browse exams" onPress={() => router.push("/(tabs)/exams")} />
      </View>
      <View style={ui.notice}>
        <Text style={ui.body}>
          This app does not download or cache question packs. Your sign-in is stored securely on
          your device; your results remain in your online account.
        </Text>
      </View>
    </Screen>
  );
}
