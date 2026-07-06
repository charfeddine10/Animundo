
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { icons } from "@/constants/icons";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { getCurrentUser } from "@/services/auth";
import { getWatchlist } from "@/services/watchlist";

export default function Profile() {

  const [watchlistCount, setWatchlistCount] = useState(0);
  const [shortId, setshortId] = useState("");
  
useFocusEffect(
  useCallback(() => {
    const loadProfile = async () => {
      try {
        const user = await getCurrentUser();

        if (!user) return;

        const watchlist = await getWatchlist(user.$id);

        setshortId(user.$id.slice(0, 8));
        setWatchlistCount(watchlist.length);
      } catch (error) {
        console.log("Error loading profile:", error);
      }
    };

    loadProfile();
  }, [])
);
  
  return (
    <View className="flex-1 bg-primary">
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="items-center mt-24">
          <Image source={icons.logo} className="w-24 h-24 rounded-full" />

          <Text className="text-white text-2xl font-bold mt-4">Anime Fan</Text>

          <Text className="text-gray-400 mt-1">Track your anime journey</Text>

          <Text className="text-gray-400 mt-1">
            User: {shortId || "Loading..."}
          </Text>
        </View>

        <View className="flex-row justify-between mt-10">
          <View className="items-center flex-1">
            <Text className="text-white text-xl font-bold"> {watchlistCount}</Text>
            <Text className="text-gray-400">Watchlist</Text>
          </View>

          <View className="items-center flex-1">
            <Text className="text-white text-xl font-bold">--</Text>
            <Text className="text-gray-400">Completed</Text>
          </View>

          <View className="items-center flex-1">
            <Text className="text-white text-xl font-bold">--</Text>
            <Text className="text-gray-400">Favorites</Text>
          </View>
        </View>

        <View className="mt-10 gap-4">
          <TouchableOpacity className="bg-dark-200 p-4 rounded-xl">
            <Text className="text-white text-base">My Watchlist</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-dark-200 p-4 rounded-xl">
            <Text className="text-white text-base">Favorite Anime</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-dark-200 p-4 rounded-xl">
            <Text className="text-white text-base">Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-dark-200 p-4 rounded-xl">
            <Text className="text-white text-base">About</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
