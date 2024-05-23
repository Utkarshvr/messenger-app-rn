import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image, useColorScheme } from "react-native";
import colors from "tailwindcss/colors";

export default function UserAvatar({ focused }: { focused: boolean }) {
  const { user, isSignedIn } = useUser();

  const colorScheme = useColorScheme();

  if (!isSignedIn)
    return (
      <Ionicons
        name={focused ? "person" : "person-outline"}
        size={24}
        color={
          colorScheme === "dark" ? colors.neutral[100] : colors.neutral[900]
        }
      />
    );

  return (
    <>
      <Image
        source={{ uri: user?.imageUrl }}
        width={24}
        height={24}
        alt="Image"
        style={{
          borderColor: focused
            ? colorScheme === "dark"
              ? colors.neutral[100]
              : colors.neutral[900]
            : "",
          borderWidth: 1,
          borderRadius: 9999,
        }}
      />
    </>
  );
}
