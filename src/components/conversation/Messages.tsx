import MongoMessage from "@/types/mongo/MongoMessage";
import MessageItem from "../messages/MessageItem";
import { ScrollView, View, useColorScheme } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import axiosInstance from "@/config/axiosInstance";
import pusher from "@/lib/pusher";
import { PusherEvent } from "@pusher/pusher-websocket-react-native";
import { useUser } from "@clerk/clerk-expo";
import useUnseenMsgCount from "@/hooks/conversations/useUnseenMsgCount";
import { Ionicons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import MongoUser from "@/types/mongo/MongoUser";

export default function Messages({
  messages,
  conversationID,
  setMessages,
  otherUsers,
}: {
  messages: MongoMessage[];
  conversationID: string;
  setMessages: React.Dispatch<React.SetStateAction<MongoMessage[]>>;
  otherUsers: MongoUser[];
}) {
  const { user } = useUser();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const { msgCount: unseenMsgCount, setMsgCount } =
    useUnseenMsgCount(conversationID);
  const colorScheme = useColorScheme();
  const [newViewer, setNewViewer] = useState("");

  useEffect(() => {
    if (conversationID)
      (async () => {
        try {
          const { data } = await axiosInstance.put(
            `/conversations/${conversationID}/mark-msg-seen`
          );
          console.log("👁️👁️👁️MARKED AS SEEN👁️👁️👁️");
        } catch (err) {}
      })();
  }, [conversationID, messages.length]);

  useEffect(() => {
    // const convChannel = pusher.getChannel(conversationID);
    // console.log({ convChannel });
    // if (convChannel && convChannel.onEvent)
    //   convChannel.onEvent((event: PusherEvent) => {
    //     switch (event.eventName) {
    //       case "messages:new":
    //         console.log("MESSAGES | messages:new");
    //         const newMsg = JSON.parse(event.data);
    //         setNewViewer("");
    //         setMessages((prev) => [
    //           ...prev,
    //           { ...newMsg, isSelf: newMsg.sender._id === user?.id },
    //         ]);
    //         break;
    //       case "messages:delete":
    //         console.log("DELETING...");
    //         const deletedMsgID = JSON.parse(event.data);
    //         setMessages((prev) => prev.filter((m) => m._id !== deletedMsgID));
    //         break;
    //       case "conversation:seen":
    //         console.log("HAS SEEN THE CONVERSATION BROOOOO...");
    //         const viewer = JSON.parse(event.data)?.viewer;
    //         console.log("👁️CONV:SEEN👁️: ", { viewer });
    //         setNewViewer(viewer);
    //         break;

    //       default:
    //         break;
    //     }
    //   });
    console.log("SHOULD SUBSCRIBE");
    pusher
      .subscribe({
        channelName: `MESSAGES-${conversationID}`,
        onEvent: (event: PusherEvent) => {
          switch (event.eventName) {
            case "messages:new":
              const newMsg = JSON.parse(event.data);
              setNewViewer("");
              setMessages((prev) => [
                ...prev,
                { ...newMsg, isSelf: newMsg.sender._id === user?.id },
              ]);
              break;
            case "messages:delete":
              console.log("DELETING...");
              const { msgID: deletedMsgID } = JSON.parse(event.data);
              setMessages((prev) => prev.filter((m) => m._id !== deletedMsgID));
              break;
            case "conversation:seen":
              console.log("HAS SEEN THE CONVERSATION BROOOOO...");
              const viewer = JSON.parse(event.data)?.viewer;
              console.log("👁️CONV:SEEN👁️: ", { viewer });
              setNewViewer(viewer);
              break;

            default:
              break;
          }
        },
      })
      .then(() =>
        console.log(
          `🛜🛜🛜 MESSAGES ${user?.username} has subscribed to ${conversationID} 🛜🛜🛜`
        )
      )
      .catch((err) => console.log("Error while subscribing: ", err));
    return () => {
      pusher.unsubscribe({ channelName: `MESSAGES-${conversationID}` });
    };
  }, [conversationID]);

  const lastMsgViewers = useMemo(() => {
    if (newViewer !== "") {
      const viewers =
        messages.length > 0 &&
        (messages[messages.length - 1].viewers as string[]);

      console.log({
        viewers,
        lastMSG: messages[messages.length - 1]?.body,
        newViewer,
      });
      if (Array.isArray(viewers) && !viewers.includes(newViewer) && newViewer) {
        viewers.push(newViewer);
      }
      return viewers;
    }
  }, [newViewer, messages.length]);

  const isLastMsgMine =
    messages.length > 0 &&
    (messages[messages.length - 1]?.sender as MongoUser)?._id === user?.id;

  console.log({
    [user?.username || ""]: isLastMsgMine,
    otherUser: otherUsers[0]?.username,
    lastMSG: messages[messages.length - 1]?.body,
    lastMsgViewers,
  });

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      ref={scrollViewRef}
      onContentSizeChange={() =>
        scrollViewRef.current &&
        scrollViewRef.current.scrollToEnd({ animated: true })
      }
    >
      {messages.map((message, index) => (
        <MessageItem
          key={message._id}
          message={message}
          setMessages={setMessages}
          isLastMsg={messages.length - 1 === index}
        />
      ))}
      <View className="flex-row justify-end">
        {isLastMsgMine &&
          lastMsgViewers &&
          Array.isArray(lastMsgViewers) &&
          lastMsgViewers.includes(otherUsers[0]?._id || "") &&
          unseenMsgCount === 0 && (
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color={
                colorScheme === "dark"
                  ? colors.neutral[400]
                  : colors.neutral[600]
              }
            />
          )}
      </View>
    </ScrollView>
  );
}
