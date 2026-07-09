import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Animated } from "react-native";

const Header = () => {
  const router = useRouter();
  const logoAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(logoAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <View className="flex-row items-center justify-between px-5 mt-14 mb-5">
      {/* Drawer */}
      <TouchableOpacity className="p-2">
        <Ionicons name="menu" size={28} color="white" />
      </TouchableOpacity>

      {/* Logo / Brand */}

      <Animated.View
        style={{
          opacity: logoAnim,
          transform: [
            {
              scale: logoAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        }}
        className="items-center"
      >
        <Text className="text-accent text-3xl font-extrabold tracking-widest">
          Animundo
        </Text>

        <Text className="text-gray-400 text-[10px] tracking-[3px]">
          ANIME UNIVERSE
        </Text>
      </Animated.View>

      {/* Search */}
      <TouchableOpacity className="p-2" onPress={() => router.push("/search")}>
        <Ionicons name="search" size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
