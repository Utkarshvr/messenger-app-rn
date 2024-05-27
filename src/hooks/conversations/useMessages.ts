import { useEffect, useState } from "react";
import axiosInstance from "@/config/axiosInstance";
import MongoMessage from "@/types/mongo/MongoMessage";

export default function useMessages(conversationID: string) {
  const [messages, setMessages] = useState<MongoMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadMessages() {
    try {
      setIsLoading(true);

      const { data } = await axiosInstance.get(`/messages/${conversationID}`);
      console.log({ data });

      setMessages(data.messages || null);
    } catch (err: any) {
      console.log(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  return { messages, isLoading, error };
}
