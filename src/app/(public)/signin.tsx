import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { router } from "expo-router";
import colors from "tailwindcss/colors";
import Modal from "@/components/modal/Modal";
import Backdrop from "@/components/Backdrop";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [error, setError] = useState<null | {
    title: string;
    text: string;
    actions: { onPress: () => void; text: string }[];
  }>(null);

  const retrySignIn = () => setError(null);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      setIsLoggingIn(true);
      const completeSignIn = await signIn.create({
        identifier,
        password,
      });
      console.log({ completeSignIn });
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      console.log(JSON.stringify(err));
      const isidentifierNotFound =
        err.errors[0].code === "form_identifier_not_found";
      const isFormFormatInvalid =
        err.errors[0].code === "form_param_format_invalid";

      console.log({ isidentifierNotFound, code: err.errors[0].code });
      if (isidentifierNotFound)
        return setError({
          title: "Incorrect email or username",
          text: "The email or username you entered doesn't appear to belong to an account. Please check your identifier and try again.",
          actions: [{ onPress: retrySignIn, text: "Try Again" }],
        });
      else if (isFormFormatInvalid)
        return setError({
          title: "Incorrect Format",
          text: err.errors[0].longMessage,
          actions: [{ onPress: retrySignIn, text: "Try Again" }],
        });

      return setError({
        title:
          err.errors[0].message === err.errors[0].longMessage
            ? "Error"
            : err.errors[0].message,
        text: err.errors[0].longMessage,
        actions: [{ onPress: retrySignIn, text: "Try Again" }],
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-950">
      <View className="w-full p-8">
        <View className="flex flex-col gap-2 items-center justify-center mb-8">
          <Image
            source={require("../../../assets/images/messenger-logo.png")}
            style={{ width: 104, height: 104 }}
          />
          <Text className="text-base text-neutral-500 dark:text-neutral-300">
            Messenger
          </Text>
        </View>

        <View className="flex flex-col gap-2 items-center justify-center">
          <TextInput
            autoCapitalize="none"
            keyboardType="default"
            className="text-base text-neutral-900 dark:text-neutral-100 w-full bg-neutral-200 dark:bg-neutral-800 p-2 rounded-lg"
            placeholderTextColor={colors.neutral[400]}
            value={identifier}
            placeholder="Email address or username"
            onChangeText={(identifier) => setIdentifier(identifier)}
          />
          <TextInput
            value={password}
            autoCapitalize="none"
            placeholder="Password"
            className="text-base text-neutral-900 dark:text-neutral-100 w-full bg-neutral-200 dark:bg-neutral-800 p-2 rounded-lg"
            placeholderTextColor={colors.neutral[400]}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <TouchableOpacity
            onPress={onSignInPress}
            className="w-full bg-sky-600 p-2 rounded-lg items-center justify-center"
            disabled={!isLoaded}
          >
            {isLoggingIn ? (
              <ActivityIndicator color={colors.neutral[100]} />
            ) : (
              <Text className="text-base text-white">Log in</Text>
            )}
          </TouchableOpacity>
          <View className="flex flex-row gap-1">
            <Text className="text-sm text-neutral-500 dark:text-neutral-400">
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.replace("/register");
              }}
            >
              <Text className="text-sm text-sky-600">Sign up</Text>
            </TouchableOpacity>
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
    </View>
  );
}
