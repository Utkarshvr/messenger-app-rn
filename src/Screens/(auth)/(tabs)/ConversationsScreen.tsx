import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import FriendsFAB from "@/components/buttons/FriendsFAB";
import { useCallback, useEffect, useState } from "react";
import MongoConversation from "@/types/mongo/MongoConversation";
import axiosInstance from "@/config/axiosInstance";
import colors from "tailwindcss/colors";
import ConversationItem from "@/components/conversation/ConversationItem";
import pusher from "@/lib/pusher";
import { PusherEvent } from "@pusher/pusher-websocket-react-native";
import usePusher from "@/hooks/usePusher";
import Backdrop from "@/components/Backdrop";
import ConvOptionsModal from "@/components/modal/ConvOptionsModal";

export default function ConversationsScreen() {
  const { user, isLoaded } = useUser();

  const [conversationList, setConversationList] = useState<MongoConversation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [showOptionsModal, setShowOptionsModal] = useState("");

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

  const subscribeToPusher = useCallback(() => {
    const PUSHER_CONNECTION_STATE = pusher.connectionState;
    console.log({ PUSHER_CONNECTION_STATE });
    if (user?.id) {
      console.log({ PUSHER_CONNECTION_STATE: pusher.connectionState });
      pusher
        .subscribe({
          channelName: user.id,
          onEvent: (event: PusherEvent) => {
            switch (event.eventName) {
              case "conversation:update":
                const updatedConv = JSON.parse(event.data);
                console.log(event.eventName);

                setConversationList((prev) =>
                  prev.map((conv) => {
                    if (conv._id === updatedConv._id) {
                      return {
                        ...conv,
                        lastMessage: updatedConv.lastMessage,
                        lastMessagedAt: updatedConv.lastMessagedAt,
                      };
                    } else return conv;
                  })
                );

                break;
              case "conversation:new":
                const newConv = JSON.parse(event.data);
                setConversationList((prev) => [newConv, ...prev]);
                break;
              default:
                break;
            }
          },
        })
        .then(() =>
          console.log(` 🛜🛜🛜 ${user.username} has subscribed to ${user.id} 🛜🛜🛜`)
        )
        .catch((err) => console.log("Error while subscribing: ", err));
    }
  }, [user?.id, pusher]);

  useEffect(() => {
    if (isLoaded && user?.id) subscribeToPusher();
  }, [isLoaded, user?.id, pusher, subscribeToPusher]);

  function renderConvList({ item: conv }: { item: MongoConversation }) {
    return (
      <ConversationItem
        conversation={conv}
        setConversationList={setConversationList}
        setShowOptionsModal={setShowOptionsModal}
      />
    );
  }

  return (
    <View className="flex-1 bg-neutral-100 dark:bg-neutral-950 py-4">
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.sky[600]} />
      ) : (
        <>
          <FlatList
            data={conversationList}
            keyExtractor={(conv) => conv._id}
            renderItem={renderConvList}
            refreshing={refreshing}
            onRefresh={() => loadConversations(true)}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center">
                <Text className="text-neutral-400 text-sm">
                  You don't have any old chats with anyone. Start one by
                  choosing to chat with your friends
                </Text>
              </View>
            }
          />
          {showOptionsModal !== "" && (
            <Backdrop center>
              <ConvOptionsModal
                conversationID={showOptionsModal}
                setShowOptionsModal={setShowOptionsModal}
                loadConversations={loadConversations}
              />
            </Backdrop>
          )}
        </>
      )}
      <FriendsFAB />
    </View>
  );
}

const styles = StyleSheet.create({});
