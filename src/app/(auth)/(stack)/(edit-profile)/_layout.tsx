import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { TouchableHighlight, useColorScheme } from "react-native";
import colors from "tailwindcss/colors";

export default function _layout() {
  const colorScheme = useColorScheme();
  const bgColor =
    colorScheme === "dark" ? colors.neutral[950] : colors.neutral[50];
  const textColor =
    colorScheme !== "dark" ? colors.neutral[950] : colors.neutral[50];

  return (
    <Stack
      screenOptions={{
        headerLeft: ({ canGoBack }) =>
          canGoBack && (
            <TouchableHighlight
              className="rounded-full p-1 mr-4"
              activeOpacity={0.7}
              underlayColor={
                colorScheme === "dark"
                  ? colors.neutral[700]
                  : colors.neutral[200]
              }
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={24} color={textColor} />
            </TouchableHighlight>
          ),

        headerStyle: {
          backgroundColor: bgColor,
        },
        headerTitleStyle: { color: textColor },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="username"
        options={{ presentation: "modal", headerTitle: "Username" }}
      />
      <Stack.Screen
        name="password"
        options={{ presentation: "modal", headerTitle: "Password" }}
      />
      <Stack.Screen
        name="email-addresses"
        options={{ presentation: "modal", headerTitle: "Email Addresses" }}
      />
    </Stack>
  );
}
