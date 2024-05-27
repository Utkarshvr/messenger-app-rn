import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import FriendsFAB from "@/components/buttons/FriendsFAB";
import { useEffect, useState } from "react";
import MongoConversation from "@/types/mongo/MongoConversation";
import axiosInstance from "@/config/axiosInstance";
import colors from "tailwindcss/colors";
import ConversationItem from "@/components/conversation/ConversationItem";

export default function ConversationsScreen() {
  const { user, isLoaded } = useUser();

  const [conversationList, setConversationList] = useState<MongoConversation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function loadConversations(isRefreshing = false) {
    try {
      if (!isRefreshing) setIsLoading(true);
      setRefreshing(isRefreshing);

      const { data } = await axiosInstance.get("/conversations");
      setConversationList(data.conversations || []);
    } catch (err: any) {
      console.log(err);
    } finally {
      if (!isRefreshing) setIsLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadConversations();
  }, []);

  function renderConvList({ item: conv }: { item: MongoConversation }) {
    return <ConversationItem conversation={conv} />;
  }

  return (
    <View className="flex-1 bg-neutral-100 dark:bg-neutral-950 py-4">
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.sky[600]} />
      ) : (
        <FlatList
          data={conversationList}
          keyExtractor={(conv) => conv._id}
          renderItem={renderConvList}
          refreshing={refreshing}
          onRefresh={() => loadConversations(true)}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <Text className="text-neutral-400 text-sm">
                You don't have any old chats with anyone. Start one by choosing
                to chat with your friends
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
