import LoadingScreen from "@/components/LoadingScreen";
import UserAvatar from "@/components/UserAvatar";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { TouchableOpacity, View, useColorScheme } from "react-native";
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
    colorScheme === "dark" ? colors.neutral[900] : colors.neutral[50];
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
        },

        headerTitleStyle: { color: textColor },

        tabBarActiveTintColor: textColor,
        tabBarLabelStyle: { display: "none" },

        headerRight: ({ pressColor, pressOpacity, tintColor }) => {
          return (
            <>
              <View className="flex flex-row gap-2">
                <TouchableOpacity>
                  <Ionicons name={"person-add"} size={20} color={textColor} />
                </TouchableOpacity>
              </View>
            </>
          );
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
