import { Text, View } from "react-native";

export default function TextBadge({
  color,
  text,
}: {
  color: string;
  text: string;
}) {
  return (
    <View
      className="w-6 h-6 rounded-full items-center justify-center"
      style={{ backgroundColor: color }}
    >
      <Text className="m-auto text-xs font-bold text-white">{text}</Text>
    </View>
  );
}
