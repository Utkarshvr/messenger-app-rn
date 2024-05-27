import { useEffect, useState } from "react";
import MongoConversation from "@/types/mongo/MongoConversation";
import axiosInstance from "@/config/axiosInstance";

export default function useConversation(conversationID: string) {
  const [conversation, setConversation] = useState<null | MongoConversation>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadConversation() {
    try {
      setIsLoading(true);

      const { data } = await axiosInstance.get(
        `/conversations/${conversationID}`
      );
      console.log({ data });

      setConversation(data.conversation || null);
    } catch (err: any) {
      console.log(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadConversation();
  }, []);

  return { conversation, isLoading, error };
}
