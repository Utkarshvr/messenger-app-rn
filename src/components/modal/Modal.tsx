import { Text, TouchableHighlight, View, useColorScheme } from "react-native";
import colors from "tailwindcss/colors";
import Divider from "../Divider";

export default function Modal({
  title,
  text,
  actions,
}: {
  title: string;
  text: string;
  actions: { onPress: () => void; text: string }[];
}) {
  const colorScheme = useColorScheme();

  return (
    <View
      className={`flex ${
        colorScheme === "dark" ? "bg-neutral-800" : "bg-neutral-400"
      } max-w-xs rounded-lg`}
    >
      <View className="p-6 items-center justify-center">
        <Text className="text-neutral-950 dark:text-neutral-100 text-lg font-medium text-center">
          {title}
        </Text>
        <Text className="text-neutral-950 dark:text-neutral-200 text-sm text-center">
          {text}
        </Text>
      </View>

      <Divider color={colors.neutral[600]} />

      <View className="items-center justify-center">
        {actions.map((action) => (
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor={colors.neutral[700]}
            className="w-full p-2 rounded-b-lg"
            onPress={action.onPress}
          >
            <Text className="m-auto text-neutral-950 dark:text-neutral-100 text-xs">
              {action.text}
            </Text>
          </TouchableHighlight>
        ))}
      </View>
    </View>
  );
}
