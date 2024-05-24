import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, useColorScheme } from "react-native";
import colors from "tailwindcss/colors";

export default function EditBtn() {
  const colorScheme = useColorScheme();
  const onPress = () => {
    router.push("/(stack)/edit-profile");
  };

  return (
    <TouchableOpacity
      className="flex flex-row gap-2 items-center p-2"
      onPress={onPress}
    >
      <Ionicons
        name="pencil-outline"
        size={18}
        color={
          colorScheme === "dark" ? colors.neutral[100] : colors.neutral[950]
        }
        style={{ marginVertical: "auto" }}
      />
      <Text className="text-neutral-950 dark:text-neutral-100 text-base">
        Edit Profile
      </Text>
    </TouchableOpacity>
  );
}
