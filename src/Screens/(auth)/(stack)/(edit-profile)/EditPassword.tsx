import Checkbox from "expo-checkbox";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import Backdrop from "@/components/Backdrop";
import Modal from "@/components/modal/Modal";
import {
  View,
  Text,
  TouchableHighlight,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import colors from "tailwindcss/colors";

export default function EditPassword() {
  const navigation = useNavigation();

  const { user } = useUser();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signOutOfOtherSessions, setSignOutOfOtherSessions] = useState(true);

  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<null | {
    title: string;
    text: string;
    actions: { onPress: () => void; text: string }[];
  }>(null);

  const closeModal = () => setError(null);

  const onUpdatePassword = async () => {
    try {
      setIsUpdating(true);

      if (!currentPassword || !newPassword || !confirmPassword)
        return ToastAndroid.show(
          `All three fields are required`,
          ToastAndroid.SHORT
        );
      if (confirmPassword !== newPassword)
        return ToastAndroid.show(
          "Confirm Password doesn't match the New Password",
          ToastAndroid.SHORT
        );

      console.log({ currentPassword, newPassword });
      const data = await user?.updatePassword({
        currentPassword,
        newPassword,
        signOutOfOtherSessions,
      });
      console.log({ data });

      ToastAndroid.show(`Password is updated`, ToastAndroid.SHORT);

      router.back();
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      return setError({
        title:
          err.errors[0].message === err.errors[0].longMessage
            ? "Error"
            : err.errors[0].message,
        text: err.errors[0].longMessage,
        actions: [{ onPress: closeModal, text: "Try Again" }],
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Update the header options to add the button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableHighlight
          className="rounded-full p-1"
          activeOpacity={0.7}
          underlayColor={colors.sky[300]}
          disabled={
            !currentPassword ||
            !newPassword ||
            !confirmPassword ||
            confirmPassword !== newPassword
          }
          onPress={onUpdatePassword}
        >
          {isUpdating ? (
            <ActivityIndicator color={colors.sky[500]} />
          ) : (
            <Ionicons
              name="checkmark-sharp"
              size={24}
              color={
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                confirmPassword !== newPassword
                  ? colors.sky[200]
                  : colors.sky[500]
              }
            />
          )}
        </TouchableHighlight>
      ),
    });
  }, [navigation, isUpdating, currentPassword, newPassword, confirmPassword]);

  return (
    <>
      <View className="flex-1 items-center bg-neutral-100 dark:bg-neutral-950 p-4 gap-3">
        <View className="w-full flex-col">
          {/* <Text className="text-xs text-neutral-400">Current Password</Text> */}
          <TextInput
            autoCapitalize="none"
            keyboardType="default"
            className="text-base border-b border-neutral-200 text-neutral-100 w-full p-1 rounded-lg"
            placeholderTextColor={colors.neutral[400]}
            value={currentPassword || ""}
            placeholder="Current Password"
            onChangeText={(txt) => setCurrentPassword(txt)}
          />
        </View>
        <View className="w-full flex-col">
          {/* <Text className="text-xs text-neutral-400">New Password</Text> */}
          <TextInput
            autoCapitalize="none"
            keyboardType="default"
            className="text-base border-b border-neutral-200 text-neutral-100 w-full p-1 rounded-lg"
            placeholderTextColor={colors.neutral[400]}
            value={newPassword || ""}
            placeholder="New Password"
            onChangeText={(txt) => setNewPassword(txt)}
          />
        </View>
        <View className="w-full flex-col">
          {/* <Text className="text-xs text-neutral-400">Confirm Password</Text> */}
          <TextInput
            autoCapitalize="none"
            keyboardType="default"
            className="text-base border-b border-neutral-200 text-neutral-100 w-full p-1 rounded-lg"
            placeholderTextColor={colors.neutral[400]}
            value={confirmPassword || ""}
            placeholder="Confirm Password"
            onChangeText={(txt) => setConfirmPassword(txt)}
          />
        </View>
        <View className="flex flex-row gap-2">
          <Checkbox
            value={signOutOfOtherSessions}
            onValueChange={(val) => setSignOutOfOtherSessions(val)}
            color={signOutOfOtherSessions ? colors.sky[600] : undefined}
          />
          <View className="flex-col gap-1">
            <Text className="text-sm text-neutral-100 leading-4">
              Sign out of all other devices
            </Text>
            <Text className="text-xs text-neutral-300 font-thin">
              It is recommended to sign out of all other devices which may have
              used your old password
            </Text>
          </View>
        </View>
      </View>

      {error && (
        <Backdrop center>
          <Modal
            title={error.title}
            text={error.text}
            actions={error.actions}
          />
        </Backdrop>
      )}
    </>
  );
}
