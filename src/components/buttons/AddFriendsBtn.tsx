import React, { useEffect, useState } from "react";
import axiosInstance from "@/config/axiosInstance";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity, View, useColorScheme } from "react-native";
import colors from "tailwindcss/colors";
import TextBadge from "../TextBadge";
import { useUser } from "@clerk/clerk-expo";
import pusher from "@/lib/pusher";
import { PusherEvent } from "@pusher/pusher-websocket-react-native";

export default function AddFriendsBtn() {
  const colorScheme = useColorScheme();
  const [unseenReqsCount, setUnseenReqsCount] = useState(0);

  const { user } = useUser();

  const textColor =
    colorScheme === "light" ? colors.neutral[950] : colors.neutral[100];

  async function loadUnseenRequestsCount() {
    try {
      const { data } = await axiosInstance.get(
        `/users/me/requests/unseen-count`
      );

      console.log({ data_count: data.count });

      setUnseenReqsCount(data.count || 0);
    } catch (error) {
      console.log("::unseen-req-count::", error);
    }
  }

  useEffect(() => {
    if (user?.id) {
      pusher.subscribe({
        channelName: `REQ-${user.id}`,
        onEvent: (event: PusherEvent) => {
          switch (event.eventName) {
            case "friend-requests:new":
              loadUnseenRequestsCount();

              break;
            default:
              break;
          }
        },
      });
    }
  }, [user?.id]);

  useEffect(() => {
    loadUnseenRequestsCount();
  }, []);

  return (
    <View className="relative">
      <TouchableOpacity
        className="p-2 rounded-full"
        onPress={() => {
          setUnseenReqsCount(0);
          router.push("/friend-requests");
        }}
      >
        <Ionicons name={"person-add"} size={20} color={textColor} />
      </TouchableOpacity>
      {unseenReqsCount > 0 && (
        <View className="absolute top-0 right-0">
          <TextBadge color={colors.red[600]} size="xs" />
        </View>
      )}
    </View>
  );
}
