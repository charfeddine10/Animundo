import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchAnime } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();

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

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

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
            {/* SEARCH */}
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for anime"
            />

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
                  <TrendingCard anime={item} index={index} />
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
                    <TrendingCard anime={item} index={index} />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
