import { View } from "react-native";
import colors from "tailwindcss/colors";

export default function Divider({
  color,
  width = 1,
}: {
  color?: string;
  width?: number;
}) {
  return (
    <View
      style={{
        borderBottomColor: color ? color : colors.neutral[600],
        borderBottomWidth: width,
      }}
    />
  );
}
