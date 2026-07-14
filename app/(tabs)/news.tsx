import NewsCard from "@/components/NewsCard";
import { images } from "@/constants/images";
import { fetchAnimeNews } from "@/services/news";
import { enrichNewsWithImages } from "@/services/newsUtils";
import useFetch from "@/services/useFetch";
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
  const {
    data: news,
    loading: newsLoading,
    error: newsError,
  } = useFetch(async () => {
    const articles = await fetchAnimeNews();

    return enrichNewsWithImages(articles.slice(0, 10));
  });

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
        {newsLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : newsError ? (
          <Text className="text-white">Error: {newsError?.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
            {/* NEWS */}

            {news && news.length > 0 && (
              <View className="mt-8">
                <FlatList
                  data={news.slice(0, 10)}
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
