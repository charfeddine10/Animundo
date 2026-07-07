
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { icons } from "@/constants/icons";
import { useCallback, useState } from "react";
import { useFocusEffect,useRouter ,useLocalSearchParams } from "expo-router";
import { getCurrentUser } from "@/services/auth";
import { getWatchlist } from "@/services/watchlist";

export default function Profile() {



const [loading, setLoading] = useState(true);
const [watchlistCount, setWatchlistCount] = useState(0);
const [recentAnime, setRecentAnime] = useState<any[]>([]);
const [userId, setUserId] = useState("");
const router = useRouter();

useFocusEffect(
  useCallback(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        setLoading(true);

        const user = await getCurrentUser();
        if (!user) return;

        const watchlist = await getWatchlist(user.$id);

        if (!active) return;

        setUserId(user.$id.slice(0, 8));
        setWatchlistCount(watchlist.length);
        setRecentAnime(watchlist.slice(0, 3));
      } catch (error) {
        console.log("Profile load error:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [])
);

if (loading) {
  return (
    <View className="flex-1 bg-primary items-center justify-center">
      <Text className="text-white">Loading profile...</Text>
    </View>
  );
}
  
  return (
    <View className="flex-1 bg-primary">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 ,flexGrow: 1, }}
      >
        <View className="items-center mt-24">
          <Image source={icons.logo} className="w-24 h-24 rounded-full" />

          <Text className="text-white text-2xl font-bold mt-4">Anime Fan</Text>

          <Text className="text-gray-400 mt-1">Track your anime journey</Text>

          <Text className="text-gray-400 mt-1">
            User: {userId || "Loading..."}
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
         <View className="mt-8">
    <Text className="text-white text-lg font-bold mb-3">
      Recently Added
    </Text>

    {recentAnime.length === 0 ? (
  <Text className="text-gray-400">No anime yet</Text>
) : (
  recentAnime.map((item, index) => (
<TouchableOpacity
 activeOpacity={0.7}
  key={index}
  onPress={() => router.push(`/movies/${item.animeId}`)}
  className="bg-dark-200 p-3 rounded-lg mb-3 flex-row items-center"
>
  <Image
    source={{ uri: item.posterUrl }}
    className="w-12 h-16 rounded-md"
    resizeMode="cover"
  />

  <Text className="text-white ml-3 flex-1">
    {item.title}
  </Text>
</TouchableOpacity>
  ))
)}
  </View>
      </ScrollView>
    </View>
  );
}
