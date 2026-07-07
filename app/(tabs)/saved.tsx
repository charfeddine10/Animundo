// import { icons } from "@/constants/icons";
// import React from "react";
// import { Image, Text, View } from "react-native";

// const Saved = () => {
//   return (
//     <View className="bg-primary flex-1 px-10">
//       <View className="flex justify-center items-center flex-1 flex-col gap-5">
//         <Image source={icons.save} className="size-10" tintColor="#FFF" />
//         <Text className="text-gray-500 text-base">Save</Text>
//       </View>
//     </View>
//   );
// };

// export default Saved;

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image } from "react-native";

import { getWatchlist } from "@/services/watchlist";
import { getCurrentUser } from "@/services/auth";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const Saved = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  

  // useEffect(() => {
  //   const loadWatchlist = async () => {
  //     try {
  //       const user = await getCurrentUser();

  //       if (!user) return;

  //       const result = await getWatchlist(user.$id);

  //       setData(result);
  //     } catch (error) {
  //       console.log("Error loading watchlist:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadWatchlist();
  // }, []);


  useFocusEffect(
  useCallback(() => {
    const loadWatchlist = async () => {
      try {

         setLoading(true);
        const user = await getCurrentUser();

        if (!user) return;

        const result = await getWatchlist(user.$id);

        setData(result);
      } catch (error) {
        console.log("Error loading watchlist:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWatchlist();
  }, [])
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
      <Text className="text-white text-xl font-bold mb-5">
        My Watchlist
      </Text>

      {data.length === 0 ? (
        <Text className="text-gray-400">
          No anime saved yet
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
           contentContainerStyle={{  paddingBottom: 120 , }}
          renderItem={({ item }) => (
            <View className="mr-2">
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
                {item.title.substring(0,15) + '...'}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Saved;
