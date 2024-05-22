import { StyleSheet, Text, View } from "react-native";
import { useUser } from "@clerk/clerk-expo";

export default function home() {
  const { user, isLoaded } = useUser();

  return (
    <View>
      <Text>Home</Text>
      <Text>Hi, {user?.username}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
