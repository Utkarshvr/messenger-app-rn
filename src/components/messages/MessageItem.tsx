import MongoMessage from "@/types/mongo/MongoMessage";
import React, { useState } from "react";
import {
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity,
  GestureResponderEvent,
  Vibration,
  ActivityIndicator,
} from "react-native";
import colors from "tailwindcss/colors";

import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";

import { Ionicons } from "@expo/vector-icons";
import { formatMsgDate } from "@/utility/helpers";
import axiosInstance from "@/config/axiosInstance";
import useUnseenMsgCount from "@/hooks/conversations/useUnseenMsgCount";

export default function MessageItem({
  message,
  setMessages,
  isLastMsg,
}: {
  message: MongoMessage;
  setMessages: React.Dispatch<React.SetStateAction<MongoMessage[]>>;
  isLastMsg: boolean;
}) {
  const isSelf = message.isSelf;
  const [showMenu, setShowMenu] = useState(false);
  const [componentHeight, setComponentHeight] = useState(0);

  const [isDeletingMsg, setIsDeletingMsg] = useState(false);

  const onLongPress = (event: GestureResponderEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    setShowMenu(true);
  };

  const hideMenu = () => {
    // Hide the menu
    setShowMenu(false);
  };

  const copyMsg = async () => {
    await Clipboard.setStringAsync(message.body);
    hideMenu();
  };

  const deleteMsg = async () => {
    try {
      // setMessages((prev) => prev.filter((msg) => msg._id !== message._id));

      setIsDeletingMsg(true);
      await axiosInstance.delete(`/messages/${message._id}`);
    } catch (error) {
      // setMessages((prev) => [...prev, message]);

      console.log(error);
    } finally {
      setIsDeletingMsg(false);
    }
    hideMenu();
  };

  return (
    <>
      <View>
        <TouchableHighlight
          activeOpacity={1}
          touchSoundDisabled={false}
          underlayColor={isSelf ? colors.sky[900] : colors.neutral[900]}
          className={`mb-2 p-2 rounded-xl max-w-[80%] ${
            isSelf ? "bg-sky-800 self-end" : "bg-neutral-800 self-start"
          } z-10`}
          onLongPress={onLongPress}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setComponentHeight(height);
          }}
        >
          <Text className={`text-neutral-50`}>{message.body}</Text>
        </TouchableHighlight>

        {/* Popup Menu */}
        {showMenu && (
          <View
            className="rounded-md bg-neutral-800 min-w-[160px]"
            style={{
              position: "absolute",
              zIndex: 30,

              ...(isLastMsg
                ? { bottom: componentHeight + 10 }
                : { top: componentHeight + 3 }),
              ...(isSelf ? { right: 0 } : { left: 0 }),
            }}
          >
            <Text className="text-neutral-400 p-2 text-xs">
              {formatMsgDate(new Date(message.createdAt))}
            </Text>
            <TouchableHighlight
              onPress={copyMsg}
              underlayColor={colors.neutral[900]}
              className={`p-3 ${isSelf ? "rounded-t-md" : "rounded-md"}`}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-white text-base">Copy</Text>
                <Ionicons name="copy-outline" color={colors.white} size={20} />
              </View>
            </TouchableHighlight>
            {isSelf && (
              <TouchableHighlight
                onPress={deleteMsg}
                underlayColor={colors.neutral[900]}
                className="p-3 rounded-b-md"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-red-600 text-base">Delete</Text>
                  {isDeletingMsg ? (
                    <ActivityIndicator color={colors.red[600]} />
                  ) : (
                    <Ionicons
                      name="trash-outline"
                      color={colors.red[600]}
                      size={20}
                    />
                  )}
                </View>
              </TouchableHighlight>
            )}
            {/* Add more options as needed */}
          </View>
        )}
      </View>
      {/* Close Menu When Clicked Outside */}
      {showMenu && (
        <TouchableOpacity
          style={{
            position: "absolute",
            // backgroundColor: "rgba(0,0,0,0.2)",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 20, // Ensure it's behind the menu
          }}
          onPress={isDeletingMsg ? () => {} : hideMenu}
        />
      )}
    </>
  );
}
