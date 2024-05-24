import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import colors from "tailwindcss/colors";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Divider from "@/components/Divider";

export default function EditProfile() {
  const { user } = useUser();

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
      <View className="flex gap-1 flex-col items-center justify-center p-3">
        <Image
          source={{ uri: user?.imageUrl }}
          width={92}
          height={92}
          alt="Image"
          style={{
            borderWidth: 1,
            borderRadius: 9999,
          }}
        />
        <TouchableOpacity>
          <Text className="text-sm text-sky-600">Edit picture</Text>
        </TouchableOpacity>
      </View>
      <View className="w-full gap-3 flex-col p-3">
        <View className="w-full flex-col">
          <Text className="text-xs text-neutral-400">Username</Text>
          <TextInput
            onPress={() => router.push("/(edit-profile)/username")}
            autoCapitalize="none"
            keyboardType="default"
            className="text-base border-b border-neutral-200 text-neutral-100 w-full p-1 rounded-lg"
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
          activeOpacity={0.6}
          underlayColor={colors.neutral[900]}
          onPress={() => router.push("/(edit-profile)/email-addresses")}
        >
          <View className="flex flex-row items-center justify-center gap-2">
            <MaterialCommunityIcons
              className="mt-auto"
              name="email-edit-outline"
              size={16}
              color={colors.neutral[100]}
            />
            <Text className="m-auto text-neutral-950 dark:text-neutral-100 text-sm">
              Manage email addresses
            </Text>
          </View>
        </TouchableHighlight>
        <Divider color={colors.neutral[500]} width={4} />
        <TouchableHighlight
          className="w-full p-4 flex flex-row items-center"
          activeOpacity={0.6}
          underlayColor={colors.neutral[900]}
          onPress={() => router.push("/(edit-profile)/password")}
        >
          <View className="flex flex-row items-center justify-center gap-2">
            <Ionicons
              className="mt-auto"
              name="key-outline"
              size={16}
              color={colors.neutral[100]}
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
