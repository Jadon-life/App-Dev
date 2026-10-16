import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "../src/providers/AuthProvider";
import { Colors } from "../src/constants/theme";
import { Button, Heading, Screen } from "../src/components/ui";
import { configurationError } from "../src/lib/supabase";
import { openWeb, getWebUrl } from "../src/lib/web-link";
export default function RootLayout() {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="light" />
        {configurationError ? (
          <Screen>
            <Heading
              eyebrow="CrysLearn"
              title="Let's connect your study desk"
              description={configurationError}
            />
            {getWebUrl("/") && (
              <Button
                title="Open CrysLearn on the web"
                onPress={() => {
                  void openWeb("/");
                }}
              />
            )}
          </Screen>
        ) : (
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.background.dark },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        )}
      </AuthProvider>
    </QueryClientProvider>
  );
}
