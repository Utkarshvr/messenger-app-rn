import {
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  useColorScheme,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import colors from "tailwindcss/colors";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Divider from "@/components/Divider";
import EditProfileImg from "@/components/EditProfileImg";

export default function EditProfile() {
  const { user } = useUser();
  const theme = useColorScheme();

  const [userDetails, setUserDetails] = useState({
    username: "",
  });

  useEffect(() => {
    setUserDetails({
      username: user?.username || "",
    });
  }, [user]);

  return (
    <ScrollView className="flex-1 bg-neutral-100 dark:bg-neutral-950">
      <EditProfileImg />
      <View className="w-full gap-3 flex-col p-3">
        <View className="w-full flex-col">
          <Text className="text-xs text-neutral-500 dark:text-neutral-400">
            Username
          </Text>
          <TextInput
            onPress={() => router.push("/(edit-profile)/username")}
            autoCapitalize="none"
            keyboardType="default"
            className="text-base border-b border-neutral-300 dark:border-neutral-200 text-neutral-900 dark:text-neutral-100 w-full p-1 rounded-lg"
            placeholderTextColor={colors.neutral[400]}
            value={userDetails.username}
            placeholder="Username"
            onChangeText={(username) =>
              setUserDetails((prev) => ({ ...prev, username }))
            }
          />
        </View>
      </View>

      <View className="items-center justify-center">
        <TouchableHighlight
          className="w-full p-4 flex flex-row items-center"
          activeOpacity={1}
          underlayColor={
            theme === "dark" ? colors.neutral[900] : colors.neutral[200]
          }
          onPress={() => router.push("/(edit-profile)/email-addresses")}
        >
          <View className="flex flex-row items-center justify-center gap-2">
            <MaterialCommunityIcons
              className="mt-auto"
              name="email-edit-outline"
              size={16}
              color={
                theme === "dark" ? colors.neutral[100] : colors.neutral[900]
              }
            />
            <Text className="m-auto text-neutral-950 dark:text-neutral-100 text-sm">
              Manage email addresses
            </Text>
          </View>
        </TouchableHighlight>
        <Divider color={colors.neutral[500]} width={4} />
        <TouchableHighlight
          className="w-full p-4 flex flex-row items-center"
          activeOpacity={1}
          underlayColor={
            theme === "dark" ? colors.neutral[900] : colors.neutral[200]
          }
          onPress={() => router.push("/(edit-profile)/password")}
        >
          <View className="flex flex-row items-center justify-center gap-2">
            <Ionicons
              className="mt-auto"
              name="key-outline"
              size={16}
              color={
                theme === "dark" ? colors.neutral[100] : colors.neutral[900]
              }
            />
            <Text className="m-auto text-neutral-950 dark:text-neutral-100 text-sm">
              Change Password
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    </ScrollView>
  );
}
