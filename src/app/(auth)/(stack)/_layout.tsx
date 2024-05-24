import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import colors from "tailwindcss/colors";

export default function layout() {
  const colorScheme = useColorScheme();
  const bgColor =
    colorScheme === "dark" ? colors.neutral[950] : colors.neutral[50];
  const textColor =
    colorScheme !== "dark" ? colors.neutral[950] : colors.neutral[50];

  return (
    <Stack
      screenOptions={{
        headerShown: true,

        headerStyle: {
          backgroundColor: bgColor,
        },

        headerTitleStyle: { color: textColor },

        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        key={"edit-profile"}
        name="edit-profile"
        options={{ headerTitle: "Edit Profile" }}
      />
      <Stack.Screen
        key={"(edit-profile)"}
        name="(edit-profile)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
