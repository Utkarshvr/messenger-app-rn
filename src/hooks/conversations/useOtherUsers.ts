import MongoConversation from "@/types/mongo/MongoConversation";
import { useUser } from "@clerk/clerk-expo";

export default function useOtherUsers(conversation: MongoConversation | null) {
  const { user: currentUser } = useUser();

  if (!conversation) return [];

  const otherUsers = conversation.users.filter(
    (user) => user._id !== currentUser?.id
  );

  return otherUsers || [];
}
