import MongoMessage from "@/types/mongo/MongoMessage";
import MessageItem from "../messages/MessageItem";
import { ScrollView, View } from "react-native";
import { useEffect, useRef } from "react";
import axiosInstance from "@/config/axiosInstance";
import pusher from "@/lib/pusher";
import { PusherEvent } from "@pusher/pusher-websocket-react-native";
import { useUser } from "@clerk/clerk-expo";

export default function Messages({
  messages,
  conversationID,
  setMessages,
}: {
  messages: MongoMessage[];
  conversationID: string;
  setMessages: React.Dispatch<React.SetStateAction<MongoMessage[]>>;
}) {
  const { user } = useUser();
  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    if (conversationID)
      (async () => {
        try {
          const { data } = await axiosInstance.put(
            `/conversations/${conversationID}/mark-msg-seen`
          );
          console.log(data);
        } catch (err) {}
      })();
  }, [conversationID]);
  useEffect(() => {
    pusher.subscribe({
      channelName: conversationID,
      onEvent: (event: PusherEvent) => {
        switch (event.eventName) {
          case "messages:new":
            const newMsg = JSON.parse(event.data);
            setMessages((prev) => [
              ...prev,
              { ...newMsg, isSelf: newMsg.sender === user?.id },
            ]);
            break;
          case "messages:delete":
            console.log("DELETING...");
            const deletedMsgID = JSON.parse(event.data);
            setMessages((prev) => prev.filter((m) => m._id !== deletedMsgID));
            break;

          default:
            break;
        }
      },
    });
    return () => {
      pusher.unsubscribe({ channelName: conversationID });
    };
  }, [conversationID]);

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
      {messages.map((message) => (
        <MessageItem
          key={message._id}
          message={message}
          setMessages={setMessages}
        />
      ))}
    </ScrollView>
  );
}
