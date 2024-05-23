import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { router } from "expo-router";
import colors from "tailwindcss/colors";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: username,
        password,
      });
      console.log({ completeSignIn });
      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      console.log(err);
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

        <View className="flex flex-col gap-2 items-center justify-center">
          <TextInput
            autoCapitalize="none"
            className="text-base text-neutral-100 w-full bg-neutral-800 p-2 rounded-lg"
            placeholderTextColor={colors.neutral[400]}
            value={username}
            placeholder="Username"
            onChangeText={(username) => setUsername(username)}
          />
          <TextInput
            value={password}
            placeholder="Password"
            className="text-base text-neutral-100 w-full bg-neutral-800 p-2 rounded-lg"
            placeholderTextColor={colors.neutral[400]}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <TouchableOpacity
            onPress={onSignInPress}
            className="w-full bg-sky-600 p-2 rounded-lg items-center justify-center"
            disabled={!isLoaded}
          >
            <Text className="text-base text-white">Log in</Text>
          </TouchableOpacity>
          <View className="flex flex-row gap-1">
            <Text className="text-sm text-neutral-400">
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.replace("/register");
              }}
            >
              <Text className="text-sm text-sky-300">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
