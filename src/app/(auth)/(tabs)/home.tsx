import { StyleSheet, Text, View } from "react-native";
import { useUser } from "@clerk/clerk-expo";

export default function home() {
  const { user, isLoaded } = useUser();

  return (
    <View className="flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-950 ">
      <Text className="text-neutral-950 dark:text-neutral-100">Home</Text>
      <Text className="text-neutral-950 dark:text-neutral-100">
        Hi, {user?.username}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});