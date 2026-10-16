import { Alert, Linking } from "react-native";
import { resolveWebUrl } from "./web-url";
export function getWebUrl(path: string): string | null {
  return resolveWebUrl(process.env.EXPO_PUBLIC_WEB_URL || process.env.EXPO_PUBLIC_APP_URL, path);
}
export async function openWeb(path: string) {
  const url = getWebUrl(path);
  if (!url) {
    Alert.alert(
      "Web app unavailable",
      "This build needs EXPO_PUBLIC_WEB_URL to open practice and payments. Your account and saved progress remain available here.",
    );
    return;
  }
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert(
      "Couldn't open the web app",
      "Check your connection or open the CrysLearn website in your browser.",
    );
  }
}
