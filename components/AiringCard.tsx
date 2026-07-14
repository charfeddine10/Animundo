import { Image, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

type AiringCardProps = {
  anime: any;
  showTime?: boolean;
  showDay?: boolean;
};

const AiringCard = ({
  anime,
  showTime = false,
  showDay = false,
}: AiringCardProps) => {
  const handlePress = () => {
    router.push(`/movies/${anime.media.id}`);
  };

  const airingDate = anime.airingAt ? new Date(anime.airingAt * 1000) : null;

  return (
    <TouchableOpacity className="mr-4 w-32" onPress={handlePress}>
      <Image
        source={{
          uri: anime.media.coverImage.large,
        }}
        className="w-32 h-44 rounded-lg"
        resizeMode="cover"
      />

      <Text className="text-white text-xs mt-2" numberOfLines={1}>
        {anime.media.title.english || anime.media.title.romaji}
      </Text>

      <Text className="text-accent text-xs mt-1">Episode {anime.episode}</Text>

      {showTime && airingDate && (
        <Text className="text-gray-400 text-xs mt-1">
          {airingDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      )}

      {showDay && airingDate && (
        <Text className="text-gray-400 text-xs mt-1">
          {airingDate.toLocaleDateString([], {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default AiringCard;
