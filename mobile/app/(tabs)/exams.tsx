import { RefreshControl, Text, View } from "react-native";
import { useExams, useAccess } from "../../src/lib/study-data";
import { openWeb } from "../../src/lib/web-link";
import { Button, Heading, Notice, Screen, ui } from "../../src/components/ui";
import { Colors } from "../../src/constants/theme";
export default function ExamsScreen() {
  const exams = useExams();
  const access = useAccess();
  const refresh = () => {
    void exams.refetch();
    void access.refetch();
  };
  return (
    <Screen
      refreshControl={
        <RefreshControl
          refreshing={exams.isRefetching || access.isRefetching}
          onRefresh={refresh}
          tintColor={Colors.secondary}
        />
      }
    >
      <Heading
        eyebrow="Your next milestone"
        title="Find your focus."
        description="Choose an exam. Practice and secure payments open on the CrysLearn website."
      />
      {exams.isPending ? (
        <Text accessibilityLiveRegion="polite" style={ui.body}>
          Loading exams…
        </Text>
      ) : exams.isError ? (
        <>
          <Notice
            error
            message="We couldn't load the exam catalogue. Check your connection and try again."
          />
          <Button title="Try again" onPress={refresh} />
        </>
      ) : !exams.data?.length ? (
        <View style={ui.notice}>
          <Text style={ui.heading}>The catalogue is being prepared.</Text>
          <Text style={ui.body}>No active exams are available yet. Pull down to check again.</Text>
        </View>
      ) : (
        exams.data.map((exam) => {
          const unlocked = access.data?.includes(exam.id);
          return (
            <View key={exam.id} style={ui.card}>
              <View style={ui.row}>
                <Text accessibilityRole="header" style={[ui.heading, { flex: 1 }]}>
                  {exam.name}
                </Text>
                <Text
                  style={[ui.small, { color: unlocked ? Colors.secondary : Colors.text.muted }]}
                >
                  {access.isPending
                    ? "Checking access…"
                    : access.isError
                      ? "Access unavailable"
                      : unlocked
                        ? "Unlocked"
                        : "Not unlocked"}
                </Text>
              </View>
              {!unlocked && (
                <Text style={ui.body}>
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    maximumFractionDigits: 0,
                  }).format(exam.price_kobo / 100)}
                </Text>
              )}
              <Button
                title={
                  unlocked
                    ? "Practice on web"
                    : access.isError
                      ? "View exam on web"
                      : "View access options"
                }
                secondary={!unlocked}
                onPress={() => {
                  void openWeb(
                    unlocked
                      ? `/exams/${encodeURIComponent(exam.slug)}/subjects`
                      : `/pay/${encodeURIComponent(exam.slug)}`,
                  );
                }}
              />
            </View>
          );
        })
      )}
      {access.isError && (
        <Notice
          error
          message="Your access status couldn't be checked. Your purchases are safe; pull down to retry."
        />
      )}
      <Text style={ui.small}>
        A separate browser sign-in may be required. Your unlocked exams are tied to your account.
      </Text>
    </Screen>
  );
}
