import { icons } from "@/constants/icons";
import { fetchAnimeDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getCurrentUser } from "@/services/auth";
import {
  addToWatchlist,
  toggleWatchlist,
  isInWatchlist,
  toggleFavorite,
  isFavorite,
} from "@/services/watchlist";
import { fetchRecommendations } from "@/services/recommendations";
import React from "react";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimeDetails = () => {
  const insets = useSafeAreaInsets();

  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data: anime, loading } = useFetch(() =>
    fetchAnimeDetails(Number(id)),
  );

  const animeId = Number(id);

  const [saved, setSaved] = useState<boolean | null>(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [favorite, setFavorite] = useState<boolean | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    const check = async () => {
      try {
        const user = await getCurrentUser();
        if (!user || !anime) return;

        const exists = await isInWatchlist(user.$id, anime.id);

        setSaved(exists); // now we KNOW true/false

        const fav = await isFavorite(user.$id, anime.id);

        setFavorite(fav);
      } catch (error) {
        console.log(error);
        setSaved(false);
      }
    };

    check();
  }, [anime]);

  const handleToggle = async () => {
    try {
      if (!anime) return;

      setLoadingSave(true);

      const user = await getCurrentUser();
      if (!user) return;

      const result = await toggleWatchlist(user.$id, anime);

      setSaved(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSave(false);
    }
  };
  const handleFavoriteToggle = async () => {
    try {
      if (!anime) return;

      if (!saved) {
        Alert.alert(
          "Watchlist Required",
          "Add this anime to your Watchlist before marking it as a favorite.",
        );
        return;
      }

      const user = await getCurrentUser();
      if (!user) return;

      const result = await toggleFavorite(user.$id, anime.id);

      setFavorite(result);
    } catch (error) {
      console.log("Favorite error:", error);
    }
  };

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        if (!animeId) return;

        const data = await fetchRecommendations(animeId);

        setRecommendations(data);
      } catch (error) {
        console.log("Recommendation error:", error);
      }
    };

    loadRecommendations();
  }, [animeId]);

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
        {/* IMAGE */}
        <View>
          <Image
            source={{
              uri: anime?.coverImage?.extraLarge || anime?.coverImage?.large,
            }}
            className="w-full h-[550px]"
            resizeMode="cover"
          />
        </View>

        {/* CONTENT */}
        <View className="flex-col items-start justify-center mt-5 px-5">
          {/* TITLE */}
          <Text className="text-white font-bold text-xl">
            {anime?.title?.english || anime?.title?.romaji}
          </Text>

          {/* YEAR + EPISODES */}
          <View className="flex-row items-center gap-x-2 mt-2">
            <Text className="text-light-200 text-sm">
              {anime?.startDate?.year || "?"}
            </Text>
            <Text className="text-light-200 text-sm">
              • {anime?.episodes || "?"} episodes
            </Text>
          </View>

          {/* SCORE */}
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md mt-3">
            <Text className="text-white font-bold text-sm">
              ⭐ {anime?.averageScore || "N/A"}/100
            </Text>
          </View>

          {/* DESCRIPTION */}
          <View className="mt-5">
            <Text className="text-light-200 text-sm font-normal">Overview</Text>
            <Text className="text-light-100 text-sm mt-2">
              {anime?.description
                ? anime.description.replace(/<[^>]*>/g, "")
                : "N/A"}
            </Text>
          </View>

          {/* GENRES */}
          <View className="mt-5">
            <Text className="text-light-200 text-sm font-normal">Genres</Text>
            <Text className="text-light-100 text-sm mt-2">
              {anime?.genres?.join(" • ") || "N/A"}
            </Text>
          </View>
          {/* RECOMMENDATIONS */}
          {recommendations.length > 0 && (
            <View className="mt-8">
              <Text className="text-white font-bold text-xl mb-4">
                You may also like
              </Text>

              {recommendations.slice(0, 5).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={{ width: 400 }}
                  className="flex-row mb-5"
                  onPress={() => router.push(`/movies/${item.id}`)}
                >
                  <Image
                    source={{
                      uri: item.coverImage.large,
                    }}
                    className="w-20 h-28 rounded-lg"
                    resizeMode="cover"
                  />

                  <View className="ml-3 flex-1 justify-center">
                    <Text
                      className="text-white font-bold text-base"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.title.english || item.title.romaji}
                    </Text>

                    <Text className="text-light-200 mt-2">
                      ⭐ {item.averageScore || "N/A"}/100
                    </Text>

                    <Text className="text-light-200 mt-1">
                      {item.episodes || "?"} episodes
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View
        className="absolute left-0 right-0 mx-5 flex gap-3 z-50"
        style={{
          bottom: insets.bottom + 10,
        }}
      >
        <View className="flex-row items-center gap-3">
          {/* FAVORITE BUTTON */}
          <TouchableOpacity
            disabled={favorite === null}
            onPress={handleFavoriteToggle}
            style={{
              opacity: saved ? 1 : 0.5,
            }}
            className="rounded-lg h-14 w-14 items-center justify-center"
          >
            <Text className="text-4xl">
              {favorite === null ? "..." : favorite ? "❤️" : "🤍"}
            </Text>
          </TouchableOpacity>

          {/* SAVE BUTTON */}
          {saved === null ? (
            <View className="bg-gray-600 rounded-lg h-14 flex-1 items-center justify-center">
              <Text className="text-white">Loading...</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleToggle}
              disabled={loadingSave}
              className={` flex-1 rounded-lg py-3.5 items-center justify-center ${
                saved ? "bg-red-600" : "bg-green-600"
              }`}
            >
              <Text className="text-white font-semibold text-base">
                {loadingSave
                  ? "Loading..."
                  : saved
                    ? "Remove from Watchlist"
                    : "Add to Watchlist"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* BACK BUTTON */}
        <TouchableOpacity
          className="bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center"
          onPress={router.back}
        >
          <Image
            source={icons.arrow}
            className="size-5 mr-1 mt-0.5 rotate-180"
            tintColor="#fff"
          />
          <Text className="text-white font-semibold text-base">Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AnimeDetails;
