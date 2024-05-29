import axiosInstance from "@/config/axiosInstance";
import {
  Text,
  ToastAndroid,
  TouchableHighlight,
  View,
  useColorScheme,
} from "react-native";
import colors from "tailwindcss/colors";

export default function ConvOptionsModal({
  //   onDelete,
  conversationID,
  setShowOptionsModal,
  loadConversations,
}: {
  //   onDelete: () => void;
  conversationID: string;
  setShowOptionsModal: React.Dispatch<React.SetStateAction<string>>;
  loadConversations: () => void;
}) {
  const colorScheme = useColorScheme();

  const onDeleteConv = async () => {
    if (conversationID) {
      try {
        const { data } = await axiosInstance.delete(
          `/conversations/${conversationID}`
        );
        console.log({ data });
        ToastAndroid.show("Conversation is deleted", ToastAndroid.SHORT);
        loadConversations();
        setShowOptionsModal("");
      } catch (err) {
        console.log(err);
        ToastAndroid.show("Conversation not deleted", ToastAndroid.SHORT);
      }
    }
  };

  return (
    <View
      className={`flex ${
        colorScheme === "dark" ? "bg-neutral-800" : "bg-neutral-400"
      } max-w-xs rounded-lg p-4`}
    >
      <View className="mb-2">
        <Text className="text-neutral-950 dark:text-neutral-100 text-lg font-medium">
          Options
        </Text>
      </View>

      <View className="items-center justify-center">
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor={colors.neutral[700]}
          className="w-full p-2 rounded-lg bg-red-500"
          onPress={onDeleteConv}
        >
          <Text className="m-auto text-neutral-950 dark:text-neutral-100 text-xs">
            Delete Conversation
          </Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}
