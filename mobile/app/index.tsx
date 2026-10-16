import { Redirect } from "expo-router";
import { useAuth } from "../src/providers/AuthProvider";
import { Button, Heading, Loading, Screen } from "../src/components/ui";
export default function Index() {
  const { session, loading, error, retry } = useAuth();
  if (loading) return <Loading />;
  if (error)
    return (
      <Screen>
        <Heading title="Couldn't restore your session" description={error} />
        <Button title="Try again" onPress={retry} />
      </Screen>
    );
  return <Redirect href={session ? "/(tabs)" : "/(auth)/login"} />;
}
