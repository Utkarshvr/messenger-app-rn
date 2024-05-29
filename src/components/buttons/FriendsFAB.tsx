import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import colors from "tailwindcss/colors";

export default function FriendsFAB() {
  const textColor = colors.neutral[100];

  return (
    <TouchableOpacity
      className="absolute bottom-5 right-5 p-2 rounded-full bg-sky-600"
      onPress={() => router.push("/friends-list")}
    >
      <Ionicons name={"people"} size={32} color={textColor} />
    </TouchableOpacity>
  );
}
