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
        key={"add-friends"}
        name="add-friends"
        options={{ headerTitle: "Add Friends" }}
      />
      <Stack.Screen
        key={"friend-requests"}
        name="friend-requests"
        options={{ headerTitle: "Friend Requests" }}
      />
      <Stack.Screen
        key={"friends-list"}
        name="friends-list"
        options={{ headerTitle: "Your Friends" }}
      />
      <Stack.Screen
        key={"(edit-profile)"}
        name="(edit-profile)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
