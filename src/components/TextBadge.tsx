import { Text, View } from "react-native";

export default function TextBadge({
  color,
  text,
  size,
}: {
  color: string;
  text?: string;
  size?: "xs" | "sm" | "md";
}) {
  return (
    <View
      className={`${
        size === "xs" ? "w-3 h-3" : "w-6 h-6"
      } rounded-full items-center justify-center`}
      style={{ backgroundColor: color }}
    >
      <Text className="m-auto text-xs font-bold text-white">{text}</Text>
    </View>
  );
}
