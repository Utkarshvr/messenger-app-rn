import LoadingScreen from "@/components/LoadingScreen";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@clerk/clerk-expo";
import { Tabs, router } from "expo-router";
import { useColorScheme } from "react-native";

export default function _layout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <LoadingScreen />;

  if (!isSignedIn) {
    router.replace("/signin");
    return null;
  }

  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          // tabBarIcon: ({ color, focused }) => (
          //   <TabBarIcon
          //     name={focused ? "home" : "home-outline"}
          //     color={color}
          //   />
          // ),
        }}
      />
    </Tabs>
  );
}
