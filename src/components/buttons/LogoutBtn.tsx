import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, useColorScheme } from "react-native";
import colors from "tailwindcss/colors";

export default function LogoutBtn() {
  const { signOut } = useClerk();

  const colorScheme = useColorScheme();
  const onPress = () => {
    signOut();
  };

  return (
    <TouchableOpacity
      className="flex flex-row gap-2 align-items-center justify-content-center"
      onPress={onPress}
    >
      <Ionicons
        name="log-out-outline"
        size={20}
        color={
          colorScheme === "dark" ? colors.neutral[100] : colors.neutral[950]
        }
        style={{ marginVertical: "auto" }}
      />
      <Text className="text-neutral-950 dark:text-neutral-100 text-base">
        Logout
      </Text>
    </TouchableOpacity>
  );
}
