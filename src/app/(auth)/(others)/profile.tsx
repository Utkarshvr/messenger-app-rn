import { useUser } from "@clerk/clerk-expo";
import { Text, View } from "react-native";
export default function profile() {
  const { user, isLoaded } = useUser();

  return (
    <View className="flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-950 ">
      <Text className="text-neutral-950 dark:text-neutral-100">Home</Text>
      <Text className="text-neutral-950 dark:text-neutral-100">
        {user?.username}
      </Text>
    </View>
  );
}
