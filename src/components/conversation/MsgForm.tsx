import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import React from "react";
import colors from "tailwindcss/colors";
import { Ionicons } from "@expo/vector-icons";

export default function MsgForm() {
  const sendMsg = () => {};

  return (
    <View className="p-3 flex-row gap-2 items-center justify-between">
      <View className="flex-1 flex-row gap-0.5 items-center justify-between">
        <TouchableHighlight
          className="rounded-full p-2 items-center justify-center"
          underlayColor={colors.neutral[900]}
          onPress={sendMsg}
        >
          <Ionicons name="image" size={24} color={colors.white} />
        </TouchableHighlight>

        <TextInput
          autoCapitalize="none"
          keyboardType="default"
          className="text-base text-neutral-100 flex-1 border border-neutral-800 px-4 py-2 rounded-3xl"
          placeholderTextColor={colors.neutral[400]}
          // value={identifier}
          placeholder="Message..."
          // onChangeText={(identifier) => setIdentifier(identifier)}
        />
      </View>

      <TouchableHighlight
        className="rounded-full p-2 bg-sky-600 items-center justify-center"
        underlayColor={colors.sky[900]}
        onPress={sendMsg}
      >
        <Ionicons name="send" size={24} color={colors.white} />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({});
