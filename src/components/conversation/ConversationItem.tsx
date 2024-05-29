import useOtherUsers from "@/hooks/conversations/useOtherUsers";
import useUnseenMsgCount from "@/hooks/conversations/useUnseenMsgCount";
import MongoConversation from "@/types/mongo/MongoConversation";
import { router } from "expo-router";
import {
  Image,
  Text,
  TouchableHighlight,
  View,
  useColorScheme,
} from "react-native";
import colors from "tailwindcss/colors";
import TextBadge from "../TextBadge";
import { formatDateEnGB, formatMsgDate } from "@/utility/helpers";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { useCallback, useEffect, useMemo, useState } from "react";
import pusher from "@/lib/pusher";
import { PusherEvent } from "@pusher/pusher-websocket-react-native";
import MongoUser from "@/types/mongo/MongoUser";
import Backdrop from "../Backdrop";
import ConvOptionsModal from "../modal/ConvOptionsModal";

export default function ConversationItem({
  conversation,
  setConversationList,
  setShowOptionsModal,
}: {
  conversation: MongoConversation;
  setConversationList: React.Dispatch<
    React.SetStateAction<MongoConversation[]>
  >;
  setShowOptionsModal: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { user } = useUser();
  const colorScheme = useColorScheme();
  const otherUsers = useOtherUsers(conversation);

  const conversationID = conversation._id;
  const {
    msgCount: unseenMsgCount,
    setMsgCount,
    getUnseenMsgCount,
  } = useUnseenMsgCount(conversationID);

  const lastMsg = conversation.lastMessage
    ? conversation.lastMessage?.body
      ? conversation.lastMessage?.body
      : conversation.lastMessage?.image
      ? "Sent a image"
      : ""
    : "The last message is deleted";

  const isLastMsgMine =
    conversation.lastMessage?.sender === user?.id ||
    (conversation.lastMessage?.sender as MongoUser)._id === user?.id;

  const hasOtherUserSeen =
    isLastMsgMine &&
    conversation.lastMessage?.viewers?.some((v) => v === otherUsers[0]?._id);

  useEffect(() => {
    pusher
      .subscribe({
        channelName: conversationID,
        onEvent: (event: PusherEvent) => {
          switch (event.eventName) {
            case "messages:new":
              const newMsg = JSON.parse(event.data);
              setConversationList((prev) => {
                return prev.map((cv) => {
                  if (cv._id !== conversationID) return cv;

                  console.log("👽👽LAST MSG UPDATED👽👽");
                  return {
                    ...cv,
                    lastMessage: {
                      ...newMsg,
                      isSelf: newMsg.sender._id === user?.id,
                    },
                  };
                });
              });
              break;
            case "messages:delete":
              const { msgID: deletedMsgID, previousMsg } = JSON.parse(
                event.data
              );
              setConversationList((prev) => {
                return prev.map((cv) => {
                  if (cv._id !== conversationID) return cv;

                  console.log("🗑️🗑️LAST MSG DELETED🗑️🗑️");
                  console.log({
                    isLastMsgDeleted: cv.lastMessage._id === deletedMsgID,
                    previousMsg,
                  });

                  return {
                    ...cv,
                    lastMessage:
                      cv.lastMessage._id === deletedMsgID
                        ? previousMsg
                        : cv.lastMessage,
                    lastMessagedAt: previousMsg.createdAt,
                  };
                });
              });
              break;

            case "conversation:seen":
              const newViewer = JSON.parse(event.data)?.viewer;
              console.log("👁️CONV:SEEN👁️: ", {
                newViewer,
                username: user?.username,
              });

              if (newViewer !== "") {
                setConversationList((prev) => {
                  return prev.map((cv) => {
                    if (cv._id !== conversationID) return cv;

                    const lastConvMsg = cv.lastMessage;
                    console.log(
                      "ADDING NEW VIEWER TO THE THE LAST MSG OF THIS CONV",
                      {
                        lastConMsg: lastConvMsg,

                        updatedLastConvMsg: {
                          ...lastConvMsg,
                          viewers: [...lastConvMsg.viewers, newViewer],
                        },
                      }
                    );

                    getUnseenMsgCount();
                    // if (![...lastConvMsg.viewers, newViewer].includes(user?.id))
                    //   setMsgCount((prev) => prev + 1);

                    return {
                      ...cv,
                      lastMessage: {
                        ...lastConvMsg,
                        viewers: [...lastConvMsg.viewers, newViewer],
                      },
                    };
                  });
                });
              }
              break;

            default:
              break;
          }
        },
      })
      .then(() =>
        console.log(
          `🛜🛜🛜 CONVERSATION_ITEM ${user?.username} has subscribed to ${conversationID}`
        )
      )
      .catch((err) => console.log("Error while subscribing: ", err));
    // return () => {
    //   pusher.unsubscribe({ channelName: conversationID });
    // };
  }, [conversationID]);

  const handleLongPress = () => {
    setShowOptionsModal(conversationID);
  };

  return (
    <>
      <TouchableHighlight
        activeOpacity={1}
        underlayColor={
          colorScheme === "dark" ? colors.neutral[800] : colors.neutral[200]
        }
        onPress={() => {
          setMsgCount(0);
          router.push(`/conversation/${conversation._id}`);
        }}
        onLongPress={handleLongPress}
      >
        <View className={`flex-row p-2 py-4 items-center justify-between`}>
          <View className="gap-2 flex-row items-center flex-[0.8]">
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
                    ? "text-neutral-600 dark:text-neutral-400"
                    : "text-neutral-800 dark:text-neutral-100"
                } text-base font-medium`}
              >
                {otherUsers[0].username}
              </Text>
              <View className="flex-row gap-1 items-center">
                {isLastMsgMine ? (
                  hasOtherUserSeen ? (
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={14}
                      color={
                        colorScheme === "dark"
                          ? colors.neutral[400]
                          : colors.neutral[600]
                      }
                    />
                  ) : (
                    <Entypo
                      name="circle"
                      size={14}
                      color={
                        colorScheme === "dark"
                          ? colors.neutral[400]
                          : colors.neutral[600]
                      }
                    />
                  )
                ) : null}
                <Text
                  className={`${
                    unseenMsgCount > 0
                      ? "text-neutral-800 dark:text-neutral-100"
                      : "text-neutral-600 dark:text-neutral-400"
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
                ? formatMsgDate(
                    conversation.lastMessagedAt &&
                      new Date(conversation.lastMessagedAt)
                  )
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
    </>
  );
}
