import Backdrop from "@/components/Backdrop";
import Modal from "@/components/modal/Modal";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TouchableHighlight,
  TextInput,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import colors from "tailwindcss/colors";

export default function EditUsername() {
  const navigation = useNavigation();

  const { user } = useUser();
  const [username, setUsername] = useState(user?.username);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<null | {
    title: string;
    text: string;
    actions: { onPress: () => void; text: string }[];
  }>(null);

  console.log({ username });

  const closeModal = () => setError(null);

  const onUpdateUsername = async () => {
    try {
      setIsUpdating(true);

      if (!username) return console.log("Username can't be empty");
      console.log({ username });
      const data = await user?.update({ username });
      console.log({ data });

      ToastAndroid.show(
        `Username is updated to ${username}`,
        ToastAndroid.SHORT
      );

      router.back();
    } catch (err: any) {
      console.log(err);
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
          onPress={onUpdateUsername}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color={colors.sky[500]} />
          ) : (
            <Ionicons
              name="checkmark-sharp"
              size={24}
              color={colors.sky[500]}
            />
          )}
        </TouchableHighlight>
      ),
    });
  }, [navigation, isUpdating, username]);

  return (
    <>
      <View className="flex-1 items-center bg-neutral-100 dark:bg-neutral-950 p-4">
        <View className="w-full flex-col">
          <Text className="text-xs text-neutral-400">Username</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="default"
            className="text-base border-b border-neutral-200 text-neutral-100 w-full p-1 rounded-lg"
            placeholderTextColor={colors.neutral[400]}
            value={username || ""}
            placeholder="Username"
            onChangeText={(txt) => setUsername(txt)}
          />
          <Text className="text-xs mt-2 text-neutral-400">
            You'll be able to change your username once in 14 days only.
          </Text>
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
