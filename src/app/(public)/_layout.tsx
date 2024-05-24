import { Stack, router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import LoadingScreen from "@/components/LoadingScreen";
import colors from "tailwindcss/colors";
import { NativeModules, Platform, useColorScheme } from "react-native";

const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;

export default function _layout() {
  const { isLoaded, isSignedIn } = useAuth();

  const colorScheme = useColorScheme();
  const bgColor =
    colorScheme === "dark" ? colors.neutral[900] : colors.neutral[50];

  if (!isLoaded) return <LoadingScreen />;

  // if (isSignedIn) {
  //   router.replace("/home");
  //   return null;
  // }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: bgColor,
        },
      }}
    />
  );
}
