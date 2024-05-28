import MongoMessage from "@/types/mongo/MongoMessage";
import MessageItem from "../messages/MessageItem";
import { ScrollView, View } from "react-native";
import { useEffect } from "react";
import axiosInstance from "@/config/axiosInstance";

export default function Messages({
  messages,
  conversationID,
  setMessages,
}: {
  messages: MongoMessage[];
  conversationID: string;
  setMessages: React.Dispatch<React.SetStateAction<MongoMessage[]>>;
}) {
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.put(
          `/conversations/${conversationID}/mark-msg-seen`
        );
        console.log(data);
      } catch (err) {}
    })();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      {messages.map((message) => (
        <MessageItem key={message._id} message={message} setMessages={setMessages} />
      ))}
    </ScrollView>
  );
}
