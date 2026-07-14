import { icons } from "@/constants/icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface MovieCardProps extends Anime {
  horizontal?: boolean;
}

const MovieCard = ({
  id,
  coverImage,
  title,
  averageScore,
  release_date,
  horizontal = false,
}: MovieCardProps) => {
  return (
    <Link href={`/movies/${id}`} asChild>
      <TouchableOpacity className={horizontal ? "w-32" : "w-[30%]"}>
        <Image
          source={{
            uri:
              coverImage?.large ||
              "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
          }}
          className={
            horizontal ? "w-32 h-44 rounded-lg" : "w-full h-52 rounded-lg"
          }
          resizeMode="cover"
        />

        <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
          {title.english || title.romaji}
        </Text>

        <View className="flex-row items-center gap-x-1">
          <Image source={icons.star} className="size-4" />

          <Text className="text-xs text-white font-bold uppercase">
            {Math.round(averageScore / 2)}
          </Text>
        </View>

        {!horizontal && (
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-light-300 font-medium mt-1">
              {release_date?.split("-")[0]}
            </Text>

            <Text className="text-xs font-medium text-light-300 uppercase">
              Anime
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
