import React from "react";
import { Button, ScrollView, TextInput } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { router } from "expo-router";

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
    <>
      <ScrollView>
        <TextInput
          autoCapitalize="none"
          style={{ color: "#fff", fontSize: 16 }}
          placeholderTextColor={"#eee"}
          value={username}
          placeholder="Username"
          onChangeText={(username) => setUsername(username)}
        />
        <TextInput
          value={password}
          placeholder="Password..."
          style={{ color: "#fff", fontSize: 16 }}
          placeholderTextColor={"#eee"}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />

        <Button onPress={onSignInPress} title="Sign in" />
        <Button
          onPress={() => {
            router.replace("/register");
          }}
          title="Register"
        />
      </ScrollView>
    </>
  );
}
