import { useEffect, useState } from "react";
import { Image, Text, TouchableHighlight, View } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import MongoConversation from "@/types/mongo/MongoConversation";
import axiosInstance from "@/config/axiosInstance";
import useOtherUsers from "@/hooks/conversations/useOtherUsers";
import colors from "tailwindcss/colors";
import { Entypo, Ionicons } from "@expo/vector-icons";

export default function ConversationScreen() {
  const { conversationID } = useLocalSearchParams();
  const navigation = useNavigation();

  const [conversation, setConversation] = useState<null | MongoConversation>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const otherUsers = useOtherUsers(conversation);

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
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadConversation();
  }, []);

  useEffect(() => {
    if (conversation)
      navigation.setOptions({
        headerLeft: () => (
          <View className="flex-row gap-2 items-center justify-center">
            {router.canGoBack() && (
              <TouchableHighlight
                className="rounded-full p-2"
                activeOpacity={0.7}
                underlayColor={colors.neutral[700]}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={colors.neutral[100]}
                />
              </TouchableHighlight>
            )}

            {!conversation.isGroup && (
              <Image
                source={{ uri: otherUsers[0].picture }}
                className="rounded-full"
                width={40}
                height={40}
                alt="user-pic"
              />
            )}
            <Text className="text-neutral-800 dark:text-neutral-100 text-base font-medium">
              {otherUsers[0].username}
            </Text>
          </View>
        ),
        headerTitle: "",
        headerRight: () => (
          <TouchableHighlight
            className="rounded-full p-2"
            activeOpacity={0.7}
            underlayColor={colors.neutral[700]}
            onPress={() => router.back()}
          >
            <Entypo
              name="dots-three-vertical"
              size={20}
              color={colors.neutral[100]}
            />
          </TouchableHighlight>
        ),
      });
  }, [navigation, conversation]);

  return (
    <View className="flex-1 bg-neutral-100 dark:bg-neutral-950 py-4">
      <Text className="text-neutral-800 dark:text-neutral-100 text-base font-medium">
        {conversationID}
      </Text>
    </View>
  );
}
