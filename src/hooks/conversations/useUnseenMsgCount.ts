import { useEffect, useState } from "react";
import axiosInstance from "@/config/axiosInstance";

export default function useUnseenMsgCount(conversationID: string) {
  const [msgCount, setMsgCount] = useState(0);

  async function getUnseenMsgCount() {
    try {
      const { data } = await axiosInstance.get(
        `/conversations/${conversationID}/unseen-msg-count`
      );
      setMsgCount(data.count || 0);
    } catch (err: any) {
      console.log(err);
      setMsgCount(0);
    }
  }

  useEffect(() => {
    getUnseenMsgCount();
  }, []);

  return msgCount;
}
