 import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "@/global.css";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { ActivityIndicator, View } from "react-native";
import { use, useState } from "react";
import Index from "./index";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [initializing, setInitializing] = useState(true);

  if(initializing){
    return(
      <Index></Index>
    )
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <SafeAreaView className="flex-1">
          <Stack>
            <Stack.Screen
              name="(account-panel)"
              options={{ headerShown: false }}
            />

            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            <Stack.Screen name="(screens)" options={{ headerShown: false }} />

            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} backgroundColor={colorScheme === "dark" ? "#000000" : "#ffffff"} translucent={false} />
    </ThemeProvider>
  );
}
 