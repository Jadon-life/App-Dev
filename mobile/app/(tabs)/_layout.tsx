import { Redirect, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert } from "react-native";
import { Colors } from "../../src/constants/theme";
import { useAuth } from "../../src/providers/AuthProvider";
import { useProfile } from "../../src/lib/study-data";
import { supabase } from "../../src/lib/supabase";
import { Button, Heading, Loading, Screen } from "../../src/components/ui";
export default function TabsLayout() {
  const { session, loading, error, retry } = useAuth();
  const profile = useProfile();
  const insets = useSafeAreaInsets();
  if (loading || (session && profile.isPending)) return <Loading />;
  if (!session) return <Redirect href="/(auth)/login" />;
  if (error || profile.isError)
    return (
      <Screen>
        <Heading
          title="Your study desk couldn't connect"
          description="Check your connection and try again. Your saved progress is safe."
        />
        <Button
          title="Try again"
          onPress={() => {
            if (error) retry();
            else void profile.refetch();
          }}
        />
        <Button
          title="Sign out"
          secondary
          onPress={() => {
            void supabase?.auth
              .signOut({ scope: "local" })
              .then(({ error: signOutError }) => {
                if (signOutError)
                  Alert.alert("Couldn't sign out", "Check your connection and try again.");
              })
              .catch(() =>
                Alert.alert("Couldn't sign out", "Check your connection and try again."),
              );
          }}
        />
      </Screen>
    );
  if (!profile.data?.name?.trim()) return <Redirect href="/(auth)/onboarding" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.text.muted,
        tabBarStyle: {
          backgroundColor: Colors.background.dark,
          borderTopColor: Colors.border.dark,
          height: 60 + insets.bottom,
          paddingBottom: Math.max(8, insets.bottom),
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: "Exams",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="offline"
        options={{
          title: "Offline",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="download-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
