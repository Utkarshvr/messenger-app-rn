import LogoutBtn from "@/components/buttons/LogoutBtn";
import { StyleSheet, View } from "react-native";

export default function settings() {
  return (
    <View className="flex-1 p-3 bg-neutral-100 dark:bg-neutral-950">
      <LogoutBtn />
    </View>
  );
}

const styles = StyleSheet.create({});
