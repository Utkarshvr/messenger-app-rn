import Backdrop from "@/components/Backdrop";
import Modal from "@/components/modal/Modal";
import axiosInstance from "@/config/axiosInstance";
import MongoFriendRequest from "@/types/mongo/MongoFriendRequest";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import colors from "tailwindcss/colors";

export default function FriendRequestsScreen() {
  const [friendRequests, setFriendRequests] = useState<MongoFriendRequest[]>(
    []
  );

  const [error, setError] = useState<null | {
    title: string;
    text: string;
    actions: { onPress: () => void; text: string }[];
  }>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [isAcceptingReq, setIsAcceptingReq] = useState("");
  const [isRejectingReq, setIsRejectingReq] = useState("");

  async function loadRequests() {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get(`/users/me/requests`);
      console.log(data);

      setFriendRequests(data.receivedRequests || []);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(true);
    }
  }

  async function acceptReq(id: string) {
    try {
      setIsAcceptingReq(id);
      await axiosInstance.put(`/friend-requests/${id}/accept`);

      ToastAndroid.show("Friend request accepted", ToastAndroid.SHORT);
      loadRequests();
    } catch (err: any) {
      return setError({
        title:
          err.errors[0].message === err.errors[0].longMessage
            ? "Error"
            : err.errors[0].message,
        text: err.errors[0].longMessage,
        actions: [{ onPress: () => setError(null), text: "Okay" }],
      });
    } finally {
      setIsAcceptingReq("");
    }
  }

  async function rejectReq(id: string) {
    try {
      setIsRejectingReq(id);
      await axiosInstance.put(`/friend-requests/${id}/reject`);
      ToastAndroid.show("Friend request rejected", ToastAndroid.SHORT);
      loadRequests();
    } catch (error) {
      console.log(error);
    } finally {
      setIsRejectingReq("");
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <>
      <ScrollView className="flex-1 bg-neutral-100 dark:bg-neutral-950 p-4">
        <View className="flex-row gap-2 mb-4">
          <TouchableHighlight
            className="w-fit px-4 py-2 flex-row items-center rounded-md bg-neutral-800"
            activeOpacity={0.6}
            underlayColor={colors.neutral[800]}
            onPress={() => router.push("/add-friends")}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons
                className="mt-auto w-fit"
                name="person-add-outline"
                size={16}
                color={colors.neutral[100]}
              />
              <Text className="text-neutral-800 dark:text-neutral-200 text-sm font-bold">
                Add Friends
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <View className="gap-2">
          <Text className="text-neutral-800 dark:text-neutral-200 text-base font-bold">
            Requests
          </Text>
          <View className="gap-1">
            {friendRequests.map((fr) => {
              return (
                <View
                  key={fr._id}
                  className="flex-row justify-between items-center"
                >
                  <View className="gap-2 flex-row items-center">
                    <Image
                      source={{ uri: fr?.sender?.picture }}
                      className="rounded-full"
                      width={40}
                      height={40}
                      alt="user-picture"
                    />
                    <View>
                      <Text className="text-neutral-800 dark:text-neutral-100 text-base font-medium">
                        {fr.sender.username}
                      </Text>
                      <Text className="text-neutral-400 text-xs">
                        {
                          fr.sender.email_addresses.find(
                            (e) => e.id === fr.sender.primaryEmailID
                          )?.email_address
                        }
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row gap-1">
                    <TouchableHighlight
                      className="rounded-full p-2 items-center justify-center"
                      activeOpacity={1}
                      underlayColor={colors.sky[900]}
                      onPress={() => acceptReq(fr._id)}
                    >
                      {isAcceptingReq === fr._id ? (
                        <ActivityIndicator color={colors.sky[500]} />
                      ) : (
                        <Ionicons
                          name="checkmark-sharp"
                          size={24}
                          color={colors.sky[600]}
                        />
                      )}
                    </TouchableHighlight>
                    <TouchableHighlight
                      className="rounded-full p-2 items-center justify-center"
                      activeOpacity={1}
                      underlayColor={colors.red[900]}
                      onPress={() => rejectReq(fr._id)}
                    >
                      {isRejectingReq === fr._id ? (
                        <ActivityIndicator color={colors.red[500]} />
                      ) : (
                        <Ionicons
                          name="trash-outline"
                          size={24}
                          color={colors.red[500]}
                        />
                      )}
                    </TouchableHighlight>
                  </View>
                </View>
              );
            })}
            {friendRequests.length === 0 && (
              <Text className="text-neutral-300 text-sm">
                No Friend Requests to show
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {error && (
        <Backdrop center>
          <Modal
            title={error.title}
            text={error.text}
            actions={error.actions}
          />
        </Backdrop>
      )}
    </>
  );
}

const styles = StyleSheet.create({});
