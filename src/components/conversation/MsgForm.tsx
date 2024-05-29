import {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  useColorScheme,
} from "react-native";
import colors from "tailwindcss/colors";
import { Ionicons } from "@expo/vector-icons";
import MongoMessage from "@/types/mongo/MongoMessage";
import { useState } from "react";
import axiosInstance from "@/config/axiosInstance";
import { useUser } from "@clerk/clerk-expo";
import * as Crypto from "expo-crypto";

export default function MsgForm({
  setMessages,
  conversationID,
}: {
  setMessages: React.Dispatch<React.SetStateAction<MongoMessage[]>>;
  conversationID: string;
}) {
  const { user } = useUser();
  const theme = useColorScheme();
  const [text, setText] = useState("");

  const sendMsg = async () => {
    const uuid = Crypto.randomUUID();
    try {
      // setMessages((prev) => [
      //   ...prev,
      //   {
      //     _id: uuid,
      //     body: text,
      //     isSelf: true,
      //     viewers: [user?.id || ""],
      //     image: "",
      //     conversation: conversationID,
      //     sender: user?.id || "",
      //     createdAt: new Date(),
      //     updatedAt: new Date(),
      //   },
      // ]);
      await axiosInstance.post(`/messages/${conversationID}`, { body: text });
      setText("");
      console.log("Message sent succesfully!🥳🥳🥳🥳");
    } catch (error) {
      // setMessages((prev) => prev.filter((m) => m._id !== uuid));
      console.log(error);
    }
  };

  return (
    <View className="p-3 flex-row gap-2 items-center justify-between">
      <View className="flex-1 flex-row gap-0.5 items-center justify-between">
        {text.length === 0 && (
          <TouchableHighlight
            className="rounded-full p-2 items-center justify-center"
            underlayColor={
              theme === "dark" ? colors.neutral[700] : colors.neutral[200]
            }
          >
            <Ionicons
              name="image"
              size={24}
              color={
                theme === "dark" ? colors.neutral[100] : colors.neutral[800]
              }
            />
          </TouchableHighlight>
        )}

        <TextInput
          autoCapitalize="none"
          keyboardType="default"
          className="text-base text-neutral-900 dark:text-neutral-100 max-h-28 flex-1 border border-neutral-300 dark:border-neutral-800 px-4 py-2 rounded-3xl"
          placeholderTextColor={colors.neutral[400]}
          value={text}
          placeholder="Message..."
          onChangeText={(txt) => setText(txt)}
          multiline
        />
      </View>

      <TouchableHighlight
        className={`rounded-full p-2 ${
          text.length === 0
            ? "bg-neutral-100 dark:bg-neutral-800"
            : "bg-sky-600"
        } items-center justify-center`}
        underlayColor={colors.sky[900]}
        onPress={sendMsg}
        disabled={text.length === 0}
      >
        <Ionicons
          name="send"
          size={24}
          color={
            text.length === 0
              ? theme === "dark"
                ? colors.neutral[500]
                : colors.neutral[300]
              : colors.neutral[100]
          }
        />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    textAlignVertical: "top",
    textAlign: "left",
    fontSize: 16,
    color: "#FFFFFF", // Use the appropriate color code or import from your colors
    flex: 1,
    borderWidth: 1,
    borderColor: "#333333", // Use the appropriate color code or import from your colors
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
