// import React from "react";
// import { Image, Text, TouchableOpacity, View } from "react-native";

// import { NewsArticle } from "@/services/news";

// type Props = {
//   article: NewsArticle;
//   onPress?: () => void;
// };

// const NewsCard = ({ article, onPress }: Props) => {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       className="bg-light-100/10 rounded-xl overflow-hidden mb-4"
//     >
//       {/* Placeholder image for now */}
//       <View className="h-40 bg-dark-100 justify-center items-center">
//         <Text className="text-gray-400">Anime News</Text>
//       </View>

//       <View className="p-3">
//         <Text className="text-white font-bold text-base" numberOfLines={2}>
//           {article.title}
//         </Text>

//         <Text className="text-light-300 text-xs mt-2" numberOfLines={2}>
//           {article.description}
//         </Text>

//         <Text className="text-gray-400 text-xs mt-3">
//           {article.publishedAt}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default NewsCard;

// import React from "react";
// import { Linking, Text, TouchableOpacity, View } from "react-native";

// type NewsArticle = {
//   title: string;
//   description: string;
//   link: string;
//   publishedAt: string;
// };

// interface Props {
//   article: NewsArticle;
// }

// const NewsCard = ({ article }: Props) => {
//   const openArticle = () => {
//     Linking.openURL(article.link);
//   };

//   const formatDate = (date: string) => {
//     const parsedDate = new Date(date);

//     return parsedDate.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <TouchableOpacity
//       onPress={openArticle}
//       className="bg-dark-100 rounded-xl p-4 mb-4"
//       activeOpacity={0.8}
//     >
//       <View className="flex-row justify-between items-start">
//         <Text
//           className="text-white font-bold text-base flex-1 mr-3"
//           numberOfLines={2}
//         >
//           {article.title}
//         </Text>

//         <Text className="text-light-300 text-xs">
//           {formatDate(article.publishedAt)}
//         </Text>
//       </View>

//       <Text className="text-light-300 text-sm mt-3" numberOfLines={3}>
//         {article.description.replace(/<[^>]*>/g, "")}
//       </Text>

//       <View className="flex-row justify-between items-center mt-4">
//         <Text className="text-secondary text-xs font-semibold">
//           Anime News Network
//         </Text>

//         <Text className="text-secondary text-xs">Read →</Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default NewsCard;

import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import * as Linking from "expo-linking";
import { images } from "@/constants/images";

interface NewsCardProps {
  article: {
    title: string;
    description: string;
    link: string;
    publishedAt: string;
    image?: string | null;
  };
}
const NewsCard = ({ article }: NewsCardProps) => {
  const openArticle = () => {
    Linking.openURL(article.link);
  };

  const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  console.log("NEWS CARD IMAGE:", article.image);

  return (
    <TouchableOpacity
      onPress={openArticle}
      className="bg-light-100/10 rounded-xl p-4 mb-4"
      activeOpacity={0.8}
    >
      {/* <Image
        source={{
          uri:
            article.image ??
            "https://placehold.co/600x400/111827/FFFFFF?text=Anime+News",
        }}
        className="w-full h-40 rounded-xl mb-3"
        resizeMode="cover"
      /> */}
      <Image
        source={article.image ? { uri: article.image } : images.placeholder}
        className="w-full h-40 rounded-xl mb-3"
        resizeMode="cover"
      />

      <Text className="text-white font-bold text-base" numberOfLines={2}>
        {article.title}
      </Text>

      <Text className="text-light-300 text-sm mt-2" numberOfLines={3}>
        {article.description.replace(/<[^>]+>/g, "")}
      </Text>

      <View className="flex-row justify-between items-center mt-3">
        <Text className="text-gray-400 text-xs">Anime News Network</Text>

        <Text className="text-gray-400 text-xs">{date}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NewsCard;
