import { StyleSheet, View } from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { useUser } from "@clerk/clerk-expo";

export default function home() {
  const { user, isLoaded } = useUser();

  return (
    <View>
      <ThemedText type="subtitle">Home</ThemedText>
      <ThemedText type="default">Hi, {user?.username}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({});
