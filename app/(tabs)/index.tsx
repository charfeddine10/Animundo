import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";
import FeaturedCard from "@/components/FeaturedCard";
import NewsCard from "@/components/NewsCard";
import { images } from "@/constants/images";
import {
  fetchAiringAnime,
  fetchAiringToday,
  fetchAnime,
  fetchAnimeImage,
} from "@/services/api";
import { fetchAnimeNews } from "@/services/news";
import { enrichNewsWithImages } from "@/services/newsUtils";
import useFetch from "@/services/useFetch";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "@/components/Header";
import { router } from "expo-router";

export default function Index() {
  const featuredRef = useRef<FlatList>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const {
    data: latestAnime,
    loading: latestLoading,
    error: latestError,
  } = useFetch(() =>
    fetchAnime({
      query: "",
      sort: "START_DATE_DESC",
    }),
  );

  const {
    data: trendingAnime,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(() =>
    fetchAnime({
      query: "",
      sort: "TRENDING_DESC",
    }),
  );

  const {
    data: topRatedAnime,
    loading: topRatedLoading,
    error: topRatedError,
  } = useFetch(() =>
    fetchAnime({
      query: "",
      sort: "SCORE_DESC",
    }),
  );

  const { data: featuredAnime } = useFetch(() =>
    fetchAnime({
      query: "",
      sort: "POPULARITY_DESC",
    }),
  );

  const { data: airingToday } = useFetch(() => fetchAiringToday());

  const { data: airingAnime } = useFetch(fetchAiringAnime);

  const { data: news, loading: newsLoading } = useFetch(async () => {
    const articles = await fetchAnimeNews();

    return enrichNewsWithImages(articles.slice(0, 10));
  });

  const featuredData = useMemo(() => {
    if (!featuredAnime) return [];

    return [...featuredAnime.slice(0, 5), ...featuredAnime.slice(0, 5)];
  }, [featuredAnime]);

  useEffect(() => {
    if (featuredData.length === 0) return;

    const interval = setInterval(() => {
      setFeaturedIndex((prev) => {
        const next = prev + 1;

        if (next < featuredData.length) {
          featuredRef.current?.scrollToIndex({
            index: next,
            animated: true,
          });
        } else {
          featuredRef.current?.scrollToIndex({
            index: 0,
            animated: false,
          });
        }

        return next >= featuredData.length ? 0 : next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredData]);

  useEffect(() => {
    fetchAnimeImage("Solo Leveling").then((image) => {
      console.log("ANI IMAGE:", image);
    });
  }, []);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <Header />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        {latestLoading || trendingLoading || topRatedLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : latestError || trendingError || topRatedError ? (
          <Text className="text-white">
            Error:{" "}
            {latestError?.message ||
              trendingError?.message ||
              topRatedError?.message}
          </Text>
        ) : (
          <View className="flex-1 mt-5">
            {featuredAnime && (
              <View className="mt-8">
                <Text className="text-lg text-white font-bold mb-3">
                  🎬 Featured Anime
                </Text>

                <FlatList
                  horizontal
                  ref={featuredRef}
                  snapToInterval={366}
                  decelerationRate="fast"
                  showsHorizontalScrollIndicator={false}
                  data={featuredData}
                  renderItem={({ item }) => <FeaturedCard anime={item} />}
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                />
              </View>
            )}

            <View className="mt-6">
              <Text className="text-lg text-white font-bold mb-3">
                📅 Airing Today
              </Text>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={airingToday}
                keyExtractor={(item) => item.media.id.toString()}
                renderItem={({ item }) => (
                  <View className="mr-4 w-32">
                    <Image
                      source={{
                        uri: item.media.coverImage.large,
                      }}
                      className="w-32 h-44 rounded-lg"
                    />

                    <Text className="text-white text-xs mt-2" numberOfLines={1}>
                      {item.media.title.english || item.media.title.romaji}
                    </Text>

                    <Text className="text-accent text-xs mt-1">
                      Episode {item.episode}
                    </Text>

                    <Text className="text-gray-400 text-xs">
                      {new Date(item.airingAt * 1000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                )}
              />
            </View>

            <View className="mt-6">
              <Text className="text-lg text-white font-bold mb-3">
                📺 Next Episodes
              </Text>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={airingAnime}
                keyExtractor={(item) => item.media.id.toString()}
                renderItem={({ item }) => (
                  <View className="mr-4 w-32">
                    <Image
                      source={{
                        uri: item.media.coverImage.large,
                      }}
                      className="w-32 h-44 rounded-lg"
                    />

                    <Text className="text-white text-xs mt-2" numberOfLines={1}>
                      {item.media.title.english || item.media.title.romaji}
                    </Text>

                    <Text className="text-accent text-xs mt-1">
                      Ep {item.episode}
                    </Text>
                  </View>
                )}
              />
            </View>

            {/* TRENDING */}
            {trendingAnime && (
              <View className="mt-8">
                <Text className="text-lg text-white font-bold mb-3">
                  🔥 Trending Anime
                </Text>

                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={trendingAnime}
                  renderItem={({ item, index }) => (
                    <TrendingCard anime={item} index={index} />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                />
              </View>
            )}

            {/* LATEST */}
            <View className="mt-6">
              <Text className="text-lg text-white font-bold mb-3">
                🆕 Latest Anime
              </Text>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={latestAnime}
                renderItem={({ item, index }) => (
                  <MovieCard {...item} horizontal />
                )}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View className="w-4" />}
              />
            </View>

            {/* TOP RATED */}
            {topRatedAnime && (
              <View className="mt-6">
                <Text className="text-lg text-white font-bold mb-3">
                  ⭐ Top Rated Anime
                </Text>

                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={topRatedAnime}
                  renderItem={({ item, index }) => (
                    <MovieCard {...item} horizontal />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                />
              </View>
            )}
            {/* NEWS */}

            {news && news.length > 0 && (
              <View className="mt-8">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-lg text-white font-bold">
                    📰 Latest News
                  </Text>

                  <TouchableOpacity onPress={() => router.push("/news")}>
                    <Text className="text-white text-sm">See all</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={news.slice(0, 3)}
                  scrollEnabled={false}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <NewsCard article={item} />}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
