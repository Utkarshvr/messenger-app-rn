import * as React from "react";
import {
  Button,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { router } from "expo-router";
import colors from "tailwindcss/colors";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [username, setUsername] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // start the sign up process.
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        username,
        emailAddress,
        password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
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
          <Text className="text-base text-neutral-300">Messenger</Text>
        </View>

        {!pendingVerification && (
          <View className="flex flex-col gap-2 items-center justify-center">
            <TextInput
              autoCapitalize="none"
              className="text-base text-neutral-100 w-full bg-neutral-800 p-2 rounded-lg"
              placeholderTextColor={colors.neutral[400]}
              value={username}
              placeholder="username"
              onChangeText={(username) => setUsername(username)}
            />
            <TextInput
              className="text-base text-neutral-100 w-full bg-neutral-800 p-2 rounded-lg"
              placeholderTextColor={colors.neutral[400]}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email..."
              onChangeText={(email) => setEmailAddress(email)}
            />
            <TextInput
              value={password}
              className="text-base text-neutral-100 w-full bg-neutral-800 p-2 rounded-lg"
              placeholderTextColor={colors.neutral[400]}
              placeholder="Password..."
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />

            <TouchableOpacity
              onPress={onSignUpPress}
              className="w-full bg-sky-600 p-2 rounded-lg items-center justify-center"
            >
              <Text className="text-base text-white">Sign up</Text>
            </TouchableOpacity>
            <View className="flex flex-row gap-1">
              <Text className="text-sm text-neutral-400">
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  router.replace("/signin");
                }}
              >
                <Text className="text-sm text-sky-300">Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {pendingVerification && (
          <View>
            <View>
              <TextInput
                value={code}
                placeholder="Code..."
                className="text-base text-neutral-100 w-full bg-neutral-800 p-2 rounded-lg"
                placeholderTextColor={colors.neutral[400]}
                onChangeText={(code) => setCode(code)}
              />
            </View>
            <TouchableOpacity
              onPress={onSignUpPress}
              className="w-full bg-sky-600 p-2 rounded-lg items-center justify-center"
            >
              <Text className="text-base text-white">Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full bg-sky-600 p-2 rounded-lg items-center justify-center"
              onPress={onPressVerify}
            >
              <Text className="text-base text-white">Verify Email</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
