import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";

import { getWatchlist, getFavorites } from "@/services/watchlist";
import { getCurrentUser } from "@/services/auth";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useRouter } from "expo-router";

const Saved = () => {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"watchlist" | "favorites">(
    "watchlist",
  );

  useFocusEffect(
    useCallback(() => {
      const loadWatchlist = async () => {
        try {
          setLoading(true);
          const user = await getCurrentUser();

          if (!user) return;

          const result =
            activeTab === "watchlist"
              ? await getWatchlist(user.$id)
              : await getFavorites(user.$id);

          setData(result);
          setData(result);
        } catch (error) {
          console.log("Error loading watchlist:", error);
        } finally {
          setLoading(false);
        }
      };

      loadWatchlist();
    }, [activeTab]),
  );

  if (loading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary px-5 pt-10">
      <Text className="text-white text-xl font-bold mb-5">Saved</Text>

      <View className="flex-row bg-dark-200 rounded-xl mb-5 p-1">
        <TouchableOpacity
          onPress={() => setActiveTab("watchlist")}
          className={`flex-1 py-3 rounded-lg items-center ${
            activeTab === "watchlist" ? "bg-accent" : ""
          }`}
        >
          <Text className="text-white">Watchlist</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("favorites")}
          className={`flex-1 py-3 rounded-lg items-center ${
            activeTab === "favorites" ? "bg-accent" : ""
          }`}
        >
          <Text className="text-white">❤️ Favorites</Text>
        </TouchableOpacity>
      </View>

      {data.length === 0 ? (
        <Text className="text-gray-400">
          {activeTab === "watchlist"
            ? "Your watchlist is empty"
            : "No favorites yet"}
        </Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.$id}
          numColumns={3}
          columnWrapperStyle={{
            gap: 10,
            marginBottom: 10,
          }}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mr-2"
              onPress={() => router.push(`/movies/${item.animeId}`)}
            >
              <Image
                source={{ uri: item.posterUrl }}
                className="w-[100px] h-[150px] rounded-lg"
                resizeMode="cover"
              />
              <Text
                className="text-white text-xs mt-1"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.title.substring(0, 15) + "..."}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default Saved;
