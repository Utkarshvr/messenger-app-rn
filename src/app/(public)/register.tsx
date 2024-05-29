import * as React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { router } from "expo-router";
import colors from "tailwindcss/colors";
import Backdrop from "@/components/Backdrop";
import Modal from "@/components/modal/Modal";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [username, setUsername] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSigningUp, setIsSigningUp] = React.useState(false);

  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [isVerifyingEmail, setIsVerifyingEmail] = React.useState(false);

  const [error, setError] = React.useState<null | {
    title: string;
    text: string;
    actions: { onPress: () => void; text: string }[];
  }>(null);

  const retrySignIn = () => setError(null);
  // start the sign up process.
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      setIsSigningUp(true);
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
      console.log(JSON.stringify(err, null, 2));

      return setError({
        title:
          err.errors[0].code === "form_param_format_invalid"
            ? `${err.errors[0].meta.paramName + " " + err.errors[0].message}`
            : err.errors[0].code === "form_username_invalid_character"
            ? `Username is invalid`
            : err.errors[0].message === err.errors[0].longMessage
            ? "Error"
            : err.errors[0].message,
        text: err.errors[0].longMessage,
        actions: [{ onPress: retrySignIn, text: "Try Again" }],
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      setIsVerifyingEmail(true);
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      return setError({
        title:
          err.errors[0].message === err.errors[0].longMessage
            ? "Error"
            : err.errors[0].message,
        text: err.errors[0].longMessage,
        actions: [{ onPress: retrySignIn, text: "Try Again" }],
      });
    } finally {
      setIsVerifyingEmail(false);
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

        {!pendingVerification && (
          <View className="flex flex-col gap-2 items-center justify-center">
            <TextInput
              autoCapitalize="none"
              className="text-base text-neutral-900 dark:text-neutral-100 w-full bg-neutral-200 dark:bg-neutral-800 p-2 rounded-lg"
              placeholderTextColor={colors.neutral[400]}
              value={username}
              placeholder="Username"
              keyboardType="default"
              onChangeText={(username) => setUsername(username)}
            />
            <TextInput
              className="text-base text-neutral-900 dark:text-neutral-100 w-full bg-neutral-200 dark:bg-neutral-800 p-2 rounded-lg"
              placeholderTextColor={colors.neutral[400]}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={(email) => setEmailAddress(email)}
            />
            <TextInput
              value={password}
              autoCapitalize="none"
              className="text-base text-neutral-900 dark:text-neutral-100 w-full bg-neutral-200 dark:bg-neutral-800 p-2 rounded-lg"
              placeholderTextColor={colors.neutral[400]}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />

            <TouchableOpacity
              onPress={onSignUpPress}
              className="w-full bg-sky-600 p-2 rounded-lg items-center justify-center"
            >
              {isSigningUp ? (
                <ActivityIndicator color={colors.neutral[100]} />
              ) : (
                <Text className="text-base text-white">Sign up</Text>
              )}
            </TouchableOpacity>
            <View className="flex flex-row gap-1">
              <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  router.replace("/signin");
                }}
              >
                <Text className="text-sm text-sky-600">Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {pendingVerification && (
          <View>
            <View className="mb-2">
              <TextInput
                value={code}
                placeholder="Code"
                keyboardType="number-pad"
                className="text-base text-neutral-900 dark:text-neutral-100 w-full bg-neutral-200 dark:bg-neutral-800 p-2 rounded-lg"
                placeholderTextColor={colors.neutral[400]}
                onChangeText={(code) => setCode(code)}
              />
            </View>
            <TouchableOpacity
              className="w-full bg-sky-600 p-2 rounded-lg items-center justify-center"
              onPress={onPressVerify}
            >
              {isVerifyingEmail ? (
                <ActivityIndicator color={colors.neutral[100]} />
              ) : (
                <Text className="text-base text-white">Verify Email</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
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
