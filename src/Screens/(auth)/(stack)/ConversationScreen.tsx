import { useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableHighlight,
  View,
  useColorScheme,
} from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import useOtherUsers from "@/hooks/conversations/useOtherUsers";
import colors from "tailwindcss/colors";
import { Entypo, Ionicons } from "@expo/vector-icons";
import useConversation from "@/hooks/conversations/useConversation";
import useMessages from "@/hooks/conversations/useMessages";
import Messages from "@/components/conversation/Messages";
import MsgForm from "@/components/conversation/MsgForm";

export default function ConversationScreen() {
  const { conversationID } = useLocalSearchParams();
  const theme = useColorScheme();
  const navigation = useNavigation();

  if (typeof conversationID !== "string") {
    console.log(`${conversationID} is must be a string`);
    return;
  }

  const { conversation, isLoading } = useConversation(conversationID);
  const otherUsers = useOtherUsers(conversation);
  const { messages, setMessages } = useMessages(conversationID);

  useEffect(() => {
    if (conversation)
      navigation.setOptions({
        headerLeft: () => (
          <View className="flex-row gap-2 items-center justify-center">
            {router.canGoBack() && (
              <TouchableHighlight
                className="rounded-full p-2"
                activeOpacity={0.7}
                underlayColor={
                  theme === "dark" ? colors.neutral[700] : colors.neutral[200]
                }
                onPress={() => router.back()}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={
                    theme === "dark" ? colors.neutral[100] : colors.neutral[800]
                  }
                />
              </TouchableHighlight>
            )}

            {!conversation.isGroup && (
              <Image
                source={{ uri: otherUsers[0].picture }}
                className="rounded-full"
                width={36}
                height={36}
                alt="user-pic"
              />
            )}
            <Text className="text-neutral-800 dark:text-neutral-100 text-base font-medium">
              {otherUsers[0].username}
            </Text>
          </View>
        ),
        headerTitle: "",
        headerRight: () => (
          <TouchableHighlight
            className="rounded-full p-2"
            activeOpacity={0.7}
            underlayColor={
              theme === "dark" ? colors.neutral[700] : colors.neutral[200]
            }
            // onPress={() => router.back()}
          >
            <Entypo
              name="dots-three-vertical"
              size={20}
              color={
                theme === "dark" ? colors.neutral[100] : colors.neutral[800]
              }
            />
          </TouchableHighlight>
        ),
      });
  }, [navigation, conversation]);

  // console.log({ messages });

  return (
    <View className="flex-1 bg-neutral-100 dark:bg-neutral-950 pt-4">
      <View className="flex-1 px-4">
        <Messages
          messages={messages}
          conversationID={conversationID}
          setMessages={setMessages}
          otherUsers={otherUsers}
        />
      </View>
      <MsgForm setMessages={setMessages} conversationID={conversationID} />
    </View>
  );
}
