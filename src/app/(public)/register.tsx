import * as React from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { router } from "expo-router";

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
    <View>
      {!pendingVerification && (
        <View>
          <View>
            <TextInput
              autoCapitalize="none"
              style={{ color: "#fff", fontSize: 16 }}
              placeholderTextColor={"#eee"}
              value={username}
              placeholder="username"
              onChangeText={(username) => setUsername(username)}
            />
          </View>
          <View>
            <TextInput
              style={{ color: "#fff", fontSize: 16 }}
              placeholderTextColor={"#eee"}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email..."
              onChangeText={(email) => setEmailAddress(email)}
            />
          </View>

          <View>
            <TextInput
              value={password}
              style={{ color: "#fff", fontSize: 16 }}
              placeholderTextColor={"#eee"}
              placeholder="Password..."
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
          </View>

          <Button onPress={onSignUpPress} title="Sign up" />
          <Button
            onPress={() => router.replace("/signin")}
            title="Go To Sign In"
          />
        </View>
      )}
      {pendingVerification && (
        <View>
          <View>
            <TextInput
              value={code}
              placeholder="Code..."
              style={{ color: "#fff", fontSize: 16 }}
              placeholderTextColor={"#eee"}
              onChangeText={(code) => setCode(code)}
            />
          </View>
          <TouchableOpacity onPress={onPressVerify}>
            <Text>Verify Email</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
