import LoadingScreen from "@/components/LoadingScreen";
import axiosInstance from "@/config/axiosInstance";
import { initiatePusher } from "@/lib/pusher";
import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [isPusherConnected, setIsPusherConnected] = useState(false);

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

      initiatePusher()
        .then(() => {
          console.log("✅ Pusher is connected ✅");
          setIsPusherConnected(true);
        })
        .catch((err) => {
          console.log("Pusher Error", err);
          setIsPusherConnected(false);
        });
    }
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded || !isPusherConnected) return <LoadingScreen />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
