import { View } from "react-native";

export default function Divider({ color }: { color: string }) {
  return (
    <View
      style={{
        borderBottomColor: color,
        borderBottomWidth: 1,
      }}
    />
  );
}
