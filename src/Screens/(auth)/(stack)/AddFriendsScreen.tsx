import Backdrop from "@/components/Backdrop";
import Modal from "@/components/modal/Modal";
import axiosInstance from "@/config/axiosInstance";
import MongoUser from "@/types/mongo/MongoUser";
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
  TextInput,
} from "react-native";
import colors from "tailwindcss/colors";

export default function AddFriendsScreen() {
  const [error, setError] = useState<null | {
    title: string;
    text: string;
    actions: { onPress: () => void; text: string }[];
  }>(null);

  const [identifier, setIdentifier] = useState("");

  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState<MongoUser[]>([]);
  const [requestedUsers, setRequestedUsers] = useState<
    { user_id: string; req_id: string }[]
  >([]);

  const [isSendingReq, setIsSendingReq] = useState("");
  const [isCancellingReq, setIsCancellingReq] = useState("");

  async function loadsuggestedUsers() {
    try {
      setIsLoadingUsers(true);
      const { data } = await axiosInstance.get("/users/suggested");
      setSuggestedUsers(data.users);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingUsers(false);
    }
  }

  async function sendReq(id: string) {
    try {
      setIsSendingReq(id);
      const { data } = await axiosInstance.post(`/friend-requests/${id}`);
      setRequestedUsers((prev) => [
        ...prev,
        { user_id: id, req_id: data.request?._id },
      ]);
      ToastAndroid.show("Friend request sent", ToastAndroid.SHORT);
    } catch (err: any) {
      console.log(err);
      return setError({
        title:
          err.errors[0].message === err.errors[0].longMessage
            ? "Error"
            : err.errors[0].message,
        text: err.errors[0].longMessage,
        actions: [{ onPress: () => setError(null), text: "Got it" }],
      });
    } finally {
      setIsSendingReq("");
    }
  }

  async function cancelReq(req_id: string, user_id: string) {
    try {
      setIsCancellingReq(user_id);
      await axiosInstance.put(`/friend-requests/${req_id}/cancel`);
      setRequestedUsers((prev) =>
        prev.filter((req_user) => req_user.user_id !== user_id)
      );
    } catch (err: any) {
      console.log(err);
      return setError({
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
    loadsuggestedUsers();
  }, []);

  return (
    <>
      <View className="flex-1 bg-neutral-100 dark:bg-neutral-950 p-4">
        <View className="w-full gap-2 mb-4">
          {/* <Text className="text-neutral-800 dark:text-neutral-200 text-base font-bold">
            Add Friends
          </Text> */}

          {/* <View className="mb-4">
            <TextInput
              autoCapitalize="none"
              className="text-base text-neutral-900 dark:text-neutral-100 w-full bg-neutral-300 dark:bg-neutral-800 py-2 px-4 rounded-3xl"
              placeholderTextColor={colors.neutral[300]}
              value={identifier}
              placeholder="Search"
              keyboardType="default"
              onChangeText={(identifier) => setIdentifier(identifier)}
            />
          </View> */}

          <View className="">
            <Text className="mb-2 text-neutral-800 dark:text-neutral-200 text-base font-bold">
              Suggestions
            </Text>

            {suggestedUsers.map((user) => (
              <View
                key={user._id}
                className="flex-row justify-between items-center mb-4"
              >
                <View className="gap-2 flex-row items-center">
                  <Image
                    source={{ uri: user?.picture }}
                    className="rounded-full"
                    width={40}
                    height={40}
                    alt="user-picture"
                  />
                  <View>
                    <Text className="text-neutral-800 dark:text-neutral-100 text-base font-medium">
                      {user.username}
                    </Text>
                    <Text className="text-neutral-400 text-xs">
                      {
                        user.email_addresses.find(
                          (e) => e.id === user.primaryEmailID
                        )?.email_address
                      }
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-1">
                  {requestedUsers.some(
                    (req_user) => req_user.user_id === user._id
                  ) ? (
                    <TouchableHighlight
                      className="rounded-lg px-4 py-2 items-center justify-center bg-neutral-700"
                      activeOpacity={1}
                      underlayColor={colors.neutral[900]}
                      onPress={() =>
                        cancelReq(
                          requestedUsers.find(
                            (req_user) => req_user.user_id === user._id
                          )?.req_id || "",
                          requestedUsers.find(
                            (req_user) => req_user.user_id === user._id
                          )?.user_id || ""
                        )
                      }
                    >
                      {isCancellingReq ===
                      requestedUsers.find(
                        (req_user) => req_user.user_id === user._id
                      )?.user_id ? (
                        <ActivityIndicator color={colors.white} />
                      ) : (
                        <Text className="text-neutral-100 font-bold">
                          Cancel
                        </Text>
                      )}
                    </TouchableHighlight>
                  ) : (
                    <TouchableHighlight
                      className="rounded-lg px-4 py-2 items-center justify-center bg-sky-600"
                      activeOpacity={1}
                      underlayColor={colors.sky[900]}
                      onPress={() => sendReq(user._id)}
                    >
                      {isSendingReq === user._id ? (
                        <ActivityIndicator color={colors.sky[500]} />
                      ) : (
                        <Text className="text-neutral-100 font-bold">Add</Text>
                      )}
                    </TouchableHighlight>
                  )}
                </View>
              </View>
            ))}
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
