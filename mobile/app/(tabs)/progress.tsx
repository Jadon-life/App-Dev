import { router } from "expo-router";
import { RefreshControl, Text, View } from "react-native";
import { useAttempts, useExams, useProfile } from "../../src/lib/study-data";
import { Button, Heading, Notice, Screen, ui } from "../../src/components/ui";
import { Colors } from "../../src/constants/theme";
export default function ProgressScreen() {
  const attempts = useAttempts();
  const exams = useExams();
  const { data: profile } = useProfile();
  const parent = profile?.role === "parent";
  return (
    <Screen
      refreshControl={
        <RefreshControl
          refreshing={attempts.isRefetching}
          onRefresh={() => {
            void attempts.refetch();
          }}
          tintColor={Colors.secondary}
        />
      }
    >
      <Heading
        eyebrow="Evidence of your effort"
        title="A record of progress."
        description={
          profile?.role === "parent"
            ? "Student results are private until sharing has been approved."
            : "Your most recent 50 completed practice sessions, synced from your account."
        }
      />
      {parent ? (
        <View style={ui.notice}>
          <Text style={ui.heading}>Student progress stays private.</Text>
          <Text style={ui.body}>
            Parent sharing is not available yet. Existing student links do not grant access; a
            secure consent process is needed before another account’s results can be shown.
          </Text>
        </View>
      ) : attempts.isPending ? (
        <Text style={ui.body}>Loading your attempts…</Text>
      ) : attempts.isError ? (
        <>
          <Notice
            error
            message="Your progress couldn't be loaded. Check your connection and try again."
          />
          <Button
            title="Try again"
            onPress={() => {
              void attempts.refetch();
            }}
          />
        </>
      ) : !attempts.data?.length ? (
        <View style={ui.card}>
          <Text style={ui.heading}>Your first attempt is a starting point.</Text>
          <Text style={ui.body}>
            Complete a practice session on the web and its result will appear here.
          </Text>
          <Button title="Explore exams" onPress={() => router.push("/(tabs)/exams")} />
        </View>
      ) : (
        attempts.data.map((attempt) => (
          <View key={attempt.id} style={ui.card}>
            <View style={ui.row}>
              <Text style={[ui.heading, { flex: 1 }]}>
                {exams.data?.find((exam) => exam.id === attempt.exam_id)?.name || "Exam attempt"}
              </Text>
              <Text style={[ui.heading, { color: Colors.secondary }]}>Score {attempt.score}</Text>
            </View>
            <Text style={ui.small}>
              {new Date(attempt.completed_at).toLocaleString("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        ))
      )}
    </Screen>
  );
}
