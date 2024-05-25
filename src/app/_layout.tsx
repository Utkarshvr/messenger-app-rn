import colors from "tailwindcss/colors";
import { useFonts } from "expo-font";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import {
  NativeModules,
  Platform,
  StatusBar,
  View,
  useColorScheme,
} from "react-native";
import LoadingScreen from "@/components/LoadingScreen";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import AxiosInterceptor from "@/providers/AxiosInterceptor";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // useEffect(() => {
  //   // router.replace("/signin");
  //   router.replace("/(auth)/home");
  // }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === "(auth)";

    console.log("User Signedin: ", isSignedIn);

    if (isSignedIn && !inTabsGroup) {
      router.replace("/home");
    } else if (!isSignedIn) {
      router.replace("/signin");
    }
  }, [isSignedIn]);

  console.log("I am rendered");

  return (
    <AxiosInterceptor>
      <ActionSheetProvider>
        <Slot />
      </ActionSheetProvider>
    </AxiosInterceptor>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!colorScheme || !colors || !loaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={
            colorScheme === "dark" ? colors.neutral[950] : colors.neutral[100]
          }
        />
        <InitialLayout />
      </View>
    </ClerkProvider>
  );
}
