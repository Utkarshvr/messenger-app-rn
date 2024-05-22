import { StyleSheet, Text, View } from "react-native";
import { useUser } from "@clerk/clerk-expo";

export default function home() {
  const { user, isLoaded } = useUser();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text>Home</Text>
      <Text>Hi, {user?.username}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
