import { StyleSheet, Text, View } from "react-native";

export default function Badge({ text, dark }: { text: string; dark: boolean }) {
  return (
    <View
      className={`border ${
        dark
          ? "bg-neutral-900 border-neutral-400"
          : "bg-neutral-100 border-neutral-500"
      } rounded-md py-0.5 px-1`}
    >
      <Text
        className={`text-neutral-500 dark:text-neutral-300 text-xs font-medium m-auto`}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
