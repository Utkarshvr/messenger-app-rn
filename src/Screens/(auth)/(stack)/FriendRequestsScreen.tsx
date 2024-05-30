import Backdrop from "@/components/Backdrop";
import Modal from "@/components/modal/Modal";
import axiosInstance from "@/config/axiosInstance";
import MongoFriendRequest from "@/types/mongo/MongoFriendRequest";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  ActivityIndicator,
  ToastAndroid,
  FlatList,
  useColorScheme,
} from "react-native";
import colors from "tailwindcss/colors";

export default function FriendRequestsScreen() {
  const [friendRequests, setFriendRequests] = useState<MongoFriendRequest[]>(
    []
  );
  const [friendRequestsSent, setFriendRequestsSent] = useState<
    MongoFriendRequest[]
  >([]);
  const theme = useColorScheme();

  const [error, setError] = useState<null | {
    title: string;
    text: string;
    actions: { onPress: () => void; text: string }[];
  }>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [isAcceptingReq, setIsAcceptingReq] = useState("");
  const [isRejectingReq, setIsRejectingReq] = useState("");
  const [isCancellingReq, setIsCancellingReq] = useState("");

  const [typeOfReqSelected, setTypeOfReqSelected] = useState<
    "received" | "sent"
  >("received");

  const markReqsAsSeen = async () => {
    try {
      await axiosInstance.put("/friend-requests/seen");
    } catch (error) {
      console.log(error);
    }
  };

  async function loadSentRequests(isRefreshing = false) {
    try {
      if (!isRefreshing) setIsLoading(true);
      setRefreshing(isRefreshing);
      const { data } = await axiosInstance.get(`/users/me/requests?type=sent`);
      console.log(data);
      setFriendRequestsSent(data.requests || []);
    } catch (error) {
      console.log(error);
    } finally {
      if (!isRefreshing) setIsLoading(false);
      setRefreshing(false);
    }
  }

  async function loadRequests(isRefreshing = false) {
    try {
      if (!isRefreshing) setIsLoading(true);
      setRefreshing(isRefreshing);
      const { data } = await axiosInstance.get(`/users/me/requests`);
      console.log(data);
      setFriendRequests(data.requests || []);

      markReqsAsSeen();
    } catch (error) {
      console.log(error);
    } finally {
      if (!isRefreshing) setIsLoading(false);
      setRefreshing(false);
    }
  }

  async function acceptReq(id: string) {
    try {
      setIsAcceptingReq(id);
      await axiosInstance.put(`/friend-requests/${id}/accept`);
      ToastAndroid.show("Friend request accepted", ToastAndroid.SHORT);
      loadRequests();
    } catch (err: any) {
      setError({
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

  async function cancelReq(req_id: string) {
    try {
      setIsCancellingReq(req_id);
      await axiosInstance.put(`/friend-requests/${req_id}/cancel`);
      loadSentRequests();
    } catch (err: any) {
      console.log(err);
      setError({
        title:
          err.errors[0].message === err.errors[0].longMessage
            ? "Error"
            : err.errors[0].message,
        text: err.errors[0].longMessage,
        actions: [{ onPress: () => setError(null), text: "Got it" }],
      });
    } finally {
      setIsCancellingReq("");
    }
  }

  useEffect(() => {
    if (typeOfReqSelected === "received") {
      loadRequests();
    } else loadSentRequests();
  }, [typeOfReqSelected]);

  const renderReceivedRequest = ({
    item: fr,
  }: {
    item: MongoFriendRequest;
  }) => (
    <View key={fr._id} className="flex-row justify-between items-center mb-3">
      <View className="gap-2 flex-row items-center">
        <View className="relative">
          <Image
            source={{ uri: fr?.sender?.picture }}
            className="rounded-full"
            width={40}
            height={40}
            alt="user-picture"
          />
          {!fr.isSeenByReceiver && (
            <View className="absolute top-0 right-0 bg-red-500 w-3 h-3 rounded-full" />
          )}
        </View>
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
            <Ionicons name="trash-outline" size={24} color={colors.red[500]} />
          )}
        </TouchableHighlight>
      </View>
    </View>
  );

  const renderSentRequest = ({ item: fr }: { item: MongoFriendRequest }) => (
    <View key={fr._id} className="flex-row justify-between items-center mb-3">
      <View className="gap-2 flex-row items-center">
        <Image
          source={{ uri: fr?.recipient?.picture }}
          className="rounded-full"
          width={40}
          height={40}
          alt="user-picture"
        />
        <View>
          <Text className="text-neutral-800 dark:text-neutral-100 text-base font-medium">
            {fr.recipient.username}
          </Text>
          <Text className="text-neutral-400 text-xs">
            {
              fr.recipient.email_addresses.find(
                (e) => e.id === fr.recipient.primaryEmailID
              )?.email_address
            }
          </Text>
        </View>
      </View>
      <View className="flex-row gap-1">
        <TouchableHighlight
          className="rounded-lg px-4 py-2 items-center justify-center bg-neutral-700 mr-2"
          activeOpacity={1}
          underlayColor={colors.neutral[900]}
          onPress={() => cancelReq(fr._id)}
        >
          {isCancellingReq ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text className="text-neutral-100 font-bold">Cancel</Text>
          )}
        </TouchableHighlight>
      </View>
    </View>
  );

  console.log({ friendRequests, friendRequestsSent });

  return (
    <>
      <View className="flex-1 bg-neutral-100 dark:bg-neutral-950 p-4">
        <View className="flex-row gap-2 mb-4">
          <TouchableHighlight
            className="w-fit px-4 py-2 flex-row items-center rounded-md bg-neutral-200 dark:bg-neutral-800"
            activeOpacity={0.6}
            underlayColor={colors.neutral[800]}
            onPress={() => router.push("/add-friends")}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons
                className="mt-auto w-fit"
                name="person-add-outline"
                size={16}
                color={
                  theme === "dark" ? colors.neutral[100] : colors.neutral[900]
                }
              />
              <Text className="text-neutral-900 dark:text-neutral-100 text-sm font-bold">
                Add Friends
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <View className="flex-1 gap-2">
          <Text className="text-neutral-800 dark:text-neutral-200 text-base font-bold">
            Requests
          </Text>
          <View className="flex-1">
            <View className="flex-row gap-1 mb-4">
              <TouchableHighlight
                className={`rounded-lg px-4 py-2 items-center justify-center ${
                  typeOfReqSelected === "received"
                    ? "bg-neutral-400 dark:bg-neutral-700"
                    : "bg-neutral-300 dark:bg-neutral-900"
                } mr-2`}
                activeOpacity={1}
                underlayColor={
                  theme === "dark" ? colors.neutral[900] : colors.neutral[500]
                }
                onPress={() => setTypeOfReqSelected("received")}
              >
                <Text className="text-neutral-100 font-bold">Received</Text>
              </TouchableHighlight>
              <TouchableHighlight
                className={`rounded-lg px-4 py-2 items-center justify-center ${
                  typeOfReqSelected === "received"
                    ? "bg-neutral-300 dark:bg-neutral-900"
                    : "bg-neutral-400 dark:bg-neutral-700"
                }`}
                activeOpacity={1}
                underlayColor={
                  theme === "dark" ? colors.neutral[900] : colors.neutral[500]
                }
                onPress={() => setTypeOfReqSelected("sent")}
              >
                <Text className="text-neutral-100 font-bold">Sent</Text>
              </TouchableHighlight>
            </View>

            {isLoading ? (
              <ActivityIndicator size="large" color={colors.sky[600]} />
            ) : typeOfReqSelected === "received" ? (
              <FlatList
                // className="flex-1"
                data={friendRequests}
                keyExtractor={(fr) => fr._id}
                renderItem={renderReceivedRequest}
                refreshing={refreshing}
                onRefresh={() => loadRequests(true)}
                ListEmptyComponent={
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-neutral-400 text-sm">
                      Nothing to show
                    </Text>
                  </View>
                }
              />
            ) : (
              <FlatList
                // className="flex-1"
                data={friendRequestsSent}
                keyExtractor={(fr) => fr._id}
                renderItem={renderSentRequest}
                refreshing={refreshing}
                onRefresh={() => loadSentRequests(true)}
                ListEmptyComponent={
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-neutral-400 text-sm">
                      Nothing to show
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </View>

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
