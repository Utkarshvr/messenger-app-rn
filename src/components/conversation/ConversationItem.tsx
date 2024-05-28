import useOtherUsers from "@/hooks/conversations/useOtherUsers";
import useUnseenMsgCount from "@/hooks/conversations/useUnseenMsgCount";
import MongoConversation from "@/types/mongo/MongoConversation";
import { router } from "expo-router";
import { Image, Text, TouchableHighlight, View } from "react-native";
import colors from "tailwindcss/colors";
import TextBadge from "../TextBadge";
import { formatDateEnGB } from "@/utility/helpers";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";

export default function ConversationItem({
  conversation,
}: {
  conversation: MongoConversation;
}) {
  if (conversation) {
    const { user } = useUser();
    const otherUsers = useOtherUsers(conversation);
    const unseenMsgCount = useUnseenMsgCount(conversation._id);

    const lastMsg = conversation.lastMessage
      ? conversation.lastMessage?.body
        ? conversation.lastMessage?.body
        : conversation.lastMessage?.image
        ? "Sent a image"
        : ""
      : "The last message is deleted";

    const isLastMsgMine = conversation.lastMessage.sender === user?.id;
    const hasOtherUserSeen =
      isLastMsgMine &&
      conversation.lastMessage.viewers.some((v) => v === otherUsers[0]?._id);
    console.log({ hasOtherUserSeen });
    return (
      <TouchableHighlight
        activeOpacity={1}
        underlayColor={colors.neutral[800]}
        onPress={() => router.push(`/conversation/${conversation._id}`)}
      >
        <View className={`flex-row p-2 py-4 items-center justify-between`}>
          <View className="gap-2 flex-row items-center">
            <View className="relative">
              {!conversation.isGroup && (
                <Image
                  source={{ uri: otherUsers[0].picture }}
                  className="rounded-full"
                  width={40}
                  height={40}
                  alt="user-pic"
                />
              )}
            </View>
            <View>
              <Text
                className={`${
                  unseenMsgCount === 0
                    ? "text-neutral-600 dark:text-neutral-300"
                    : "text-neutral-800 dark:text-neutral-100"
                } text-base font-medium`}
              >
                {otherUsers[0].username}
              </Text>
              <View className="flex-row gap-1 items-center">
                {isLastMsgMine && hasOtherUserSeen && (
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={14}
                    color={colors.neutral[300]}
                  />
                )}
                <Text
                  className={`${
                    unseenMsgCount > 0 ? "text-neutral-200" : "text-neutral-300"
                  } text-sm font-medium`}
                  numberOfLines={1}
                >
                  {lastMsg}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-col gap-1 items-end justify-start">
            <Text
              className={`${
                unseenMsgCount > 0 ? "text-sky-600" : "text-neutral-500"
              } text-xs font-medium`}
            >
              {conversation.lastMessagedAt
                ? formatDateEnGB(conversation.lastMessagedAt.toString())
                : null}
            </Text>
            {unseenMsgCount > 0 && (
              <TextBadge
                color={colors.sky[600]}
                text={unseenMsgCount?.toString()}
              />
            )}
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
