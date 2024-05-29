import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableHighlight,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import colors from "tailwindcss/colors";
import MongoUser from "@/types/mongo/MongoUser";
import axiosInstance from "@/config/axiosInstance";
import { router } from "expo-router";

export default function FriendsList() {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [friends, setFriends] = useState<{ _id: string; friend: MongoUser }[]>(
    []
  );
  const [isRemovingFriend, setIsRemovingFriend] = useState("");
  const [isCreatingConvo, setIsCreatingConvo] = useState("");

  async function getFriendsList(isRefreshing = false) {
    try {
      if (!isRefreshing) setIsLoading(true);
      setRefreshing(isRefreshing);

      const { data } = await axiosInstance.get("users/me/friends");
      setFriends(data.friends || []);
    } catch (err: any) {
      console.log(err);
    } finally {
      if (!isRefreshing) setIsLoading(false);
      setRefreshing(false);
    }
  }

  async function removeFriend(userID: string) {
    try {
      setIsRemovingFriend(userID);
      await axiosInstance.put(`/friends/${userID}/remove`);
      ToastAndroid.show("Friend removed", ToastAndroid.SHORT);
      getFriendsList();
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsRemovingFriend("");
    }
  }

  async function createConversation(userID: string) {
    try {
      setIsCreatingConvo(userID);
      const { data } = await axiosInstance.post(`/conversations`, { userID });
      console.log({ data });
      const convID = data.conversation?._id;
      router.push(`/conversation/${convID}`);
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsCreatingConvo("");
    }
  }

  useEffect(() => {
    getFriendsList();
  }, []);

  function renderFriends({
    item: fr,
  }: {
    item: { _id: string; friend: MongoUser };
  }) {
    return (
      <View className="flex-row justify-between items-center">
        <View className="gap-2 flex-[0.75] flex-row items-center">
          <View className="relative">
            <Image
              source={{ uri: fr?.friend?.picture }}
              className="rounded-full"
              width={40}
              height={40}
              alt="fr-picture"
            />
          </View>
          <View >
            <Text
              numberOfLines={1}
              className="text-neutral-800 dark:text-neutral-100 text-base font-medium"
            >
              {fr?.friend?.username}
            </Text>
            <Text numberOfLines={1} className="text-neutral-400 text-xs">
              {
                fr?.friend?.email_addresses.find(
                  (e) => e.id === fr?.friend?.primaryEmailID
                )?.email_address
              }
            </Text>
          </View>
        </View>
        <View className="flex-row gap-1">
          <TouchableHighlight
            className={`rounded-lg p-2 items-center justify-center bg-neutral-200 dark:bg-neutral-800`}
            activeOpacity={1}
            underlayColor={colors.neutral[900]}
            onPress={() => createConversation(fr?.friend?._id)}
          >
            {isCreatingConvo === fr?.friend?._id ? (
              <ActivityIndicator color={colors.neutral[100]} />
            ) : (
              <Text className="text-neutral-800 dark:text-neutral-100 text-sm font-bold">
                Chat
              </Text>
            )}
          </TouchableHighlight>
          <TouchableHighlight
            className={`rounded-lg p-2 items-center justify-center ${
              isRemovingFriend === "" ? "bg-red-700" : "bg-red-300"
            }`}
            activeOpacity={1}
            underlayColor={colors.red[900]}
            onPress={() => removeFriend(fr?.friend?._id)}
            disabled={isRemovingFriend !== ""}
          >
            {isRemovingFriend === fr?.friend?._id ? (
              <ActivityIndicator color={colors.neutral[100]} />
            ) : (
              <Text className="text-neutral-100 text-sm font-bold">Remove</Text>
            )}
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-100 dark:bg-neutral-950 p-4">
      <Text className="text-neutral-800 dark:text-neutral-200 text-base font-bold mb-2">
        Your Friends
      </Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.sky[600]} />
      ) : (
        <FlatList
          // className="flex-1"
          data={friends}
          keyExtractor={(fr) => fr._id}
          renderItem={renderFriends}
          refreshing={refreshing}
          onRefresh={() => getFriendsList(true)}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <Text className="text-neutral-400 text-sm">Nothing to show</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
