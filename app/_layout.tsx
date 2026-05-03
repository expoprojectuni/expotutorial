import { Stack } from "expo-router";
import { AnimeProvider } from "../context/AnimeContext";

export default function RootLayout() {
  return (
    <AnimeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AnimeProvider>
  );
}
