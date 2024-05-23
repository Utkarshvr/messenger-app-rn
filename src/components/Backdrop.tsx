import { View } from "react-native";

export default function Backdrop({
  children,
  center,
}: {
  children: React.ReactNode;
  center: boolean;
}) {
  return (
    <View
      className={`absolute top-0 left-0 flex flex-1 ${
        center ? "items-center justify-center" : ""
      } p-3 w-full h-full`}
      style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
    >
      {children}
    </View>
  );
}
