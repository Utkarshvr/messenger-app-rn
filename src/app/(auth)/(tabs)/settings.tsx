import EditBtn from "@/components/buttons/EditProfileBtn";
import LogoutBtn from "@/components/buttons/LogoutBtn";
import { useUser } from "@clerk/clerk-expo";
import { StyleSheet, Text, View } from "react-native";

export default function settings() {
  const { user } = useUser();

  return (
    <View className="flex-1 p-3 bg-neutral-100 dark:bg-neutral-950">
      {user?.username && (
        <Text className="text-neutral-600 dark:text-neutral-300 text-xl font-medium my-3">
          Hi, {user?.username}
        </Text>
      )}
      <EditBtn />
      <LogoutBtn />
    </View>
  );
}

const styles = StyleSheet.create({});
