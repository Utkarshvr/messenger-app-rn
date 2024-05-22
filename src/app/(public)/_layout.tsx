import { Stack, router } from "expo-router";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import LoadingScreen from "@/components/LoadingScreen";

export default function _layout() {
  const { isLoaded, isSignedIn } = useAuth();

  console.log({ isLoaded, isSignedIn });

  if (!isLoaded) return <LoadingScreen />;

  if (isSignedIn) {
    router.replace("/home");
    return null;
  }

  return <Stack />;
}
