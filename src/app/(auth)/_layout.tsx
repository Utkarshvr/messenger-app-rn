import LoadingScreen from "@/components/LoadingScreen";
import axiosInstance from "@/config/axiosInstance";
import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      (async () => {
        try {
          const ClerkToken = await getToken();
          console.log({ ClerkToken });
          axiosInstance.defaults.headers.common["Authorization"] = ClerkToken;
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded) return <LoadingScreen />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
