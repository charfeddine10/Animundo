import { Tabs } from "expo-router";
import { Image, Text, View } from "react-native";

import { icons } from "@/constants/icons";

function TabIcon({ focused, icon, title }: any) {
  return (
    <View className="flex-1 items-center justify-center w-14">
      <Image
        source={icon}
        tintColor={focused ? "#FFB000" : "#A8B5DB"}
        className="size-6"
      />

      <Text
        className={`text-[11px] mt-1 ${
          focused ? "text-accent font-semibold" : "text-light-300"
        }`}
      >
        {title}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
          backgroundColor: "#0F0D23",
          height: 85,
          borderTopWidth: 1,
          borderTopColor: "#1F1C35",
          position: "relative",
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Search" />
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.save} title="Library" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}
