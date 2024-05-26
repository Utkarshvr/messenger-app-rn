import AddFriendsBtn from "@/components/buttons/AddFriendsBtn";
import LoadingScreen from "@/components/LoadingScreen";
import UserAvatar from "@/components/UserAvatar";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { useColorScheme } from "react-native";
import colors from "tailwindcss/colors";

const hiddenTabs = ["(others)"];

export default function _layout() {
  const { isLoaded, isSignedIn } = useAuth();
  const colorScheme = useColorScheme();

  if (!isLoaded) return <LoadingScreen />;

  if (!isSignedIn) {
    router.replace("/signin");
    return null;
  }

  const bgColor =
    colorScheme === "dark" ? colors.neutral[950] : colors.neutral[50];
  const textColor =
    colorScheme === "light" ? colors.neutral[950] : colors.neutral[100];

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopWidth: 0,
          elevation: 0,
        },
        headerStyle: {
          backgroundColor: bgColor,
          borderBottomWidth: 0,
          elevation: 0,
        },

        headerTitleStyle: { color: textColor },

        tabBarActiveTintColor: textColor,
        tabBarLabelStyle: { display: "none" },

        headerRight: () => {
          return <AddFriendsBtn />;
        },
        headerRightContainerStyle: {
          paddingHorizontal: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Messenger",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => <UserAvatar focused={focused} />,
        }}
      />

      {/* {hiddenTabs.map((tab) => (
        <Tabs.Screen
          key={tab}
          name={tab}
          options={{
            href: null,
            // headerShown: false,
            tabBarStyle: { display: "none" },
          }}
        />
      ))} */}
    </Tabs>
  );
}
