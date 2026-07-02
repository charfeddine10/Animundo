import { icons } from "@/constants/icons";
// import React from "react";
// import { Image, Text, View } from "react-native";

// const profile = () => {
//   return (
//     <View className="bg-primary flex-1 px-10">
//       <View className="flex justify-center items-center flex-1 flex-col gap-5">
//         <Image source={icons.person} className="size-10" tintColor="#FFF" />
//         <Text className="text-gray-500 text-base">Profile</Text>
//       </View>
//     </View>
//   );
// };

// export default profile;

import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  return (
    <View className="flex-1 bg-primary">
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="items-center mt-24">
          <Image source={icons.logo} className="w-24 h-24 rounded-full" />

          <Text className="text-white text-2xl font-bold mt-4">Anime Fan</Text>

          <Text className="text-gray-400 mt-1">Track your anime journey</Text>
        </View>

        <View className="flex-row justify-between mt-10">
          <View className="items-center flex-1">
            <Text className="text-white text-xl font-bold">0</Text>
            <Text className="text-gray-400">Watchlist</Text>
          </View>

          <View className="items-center flex-1">
            <Text className="text-white text-xl font-bold">0</Text>
            <Text className="text-gray-400">Completed</Text>
          </View>

          <View className="items-center flex-1">
            <Text className="text-white text-xl font-bold">0</Text>
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
      </ScrollView>
    </View>
  );
}
