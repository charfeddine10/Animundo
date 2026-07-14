import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";

import { createAnonymousSession } from "@/services/auth";

import "./globals.css";

export default function RootLayout() {
  useEffect(() => {
    const initAuth = async () => {
      await createAnonymousSession();
    };

    initAuth();
  }, []);

  return (
    <>
      <StatusBar hidden={true} />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="movie/search" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
