import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  anime: Anime;
}

const FeaturedCard = ({ anime }: Props) => {
  return (
    <Link href={`/movies/${anime.id}`} asChild>
      <TouchableOpacity className="w-[350px] h-72 rounded-xl overflow-hidden mr-4">
        <Image
          source={{
            uri: anime.coverImage?.large,
          }}
          className="absolute w-full h-full"
          resizeMode="cover"
        />

        {/* dark overlay */}
        <View className="absolute inset-0 bg-black/40" />

        <View className="absolute bottom-5 left-5">
          <Text className="text-white text-2xl font-bold" numberOfLines={2}>
            {anime.title?.english || anime.title?.romaji}
          </Text>

          <View className="flex-row mt-2 gap-x-4">
            <Text className="text-white">
              ⭐ {Math.round((anime.averageScore || 0) / 10)}
            </Text>

            <Text className="text-white">🎬 {anime.episodes || "?"} eps</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default FeaturedCard;
