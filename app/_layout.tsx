import { Stack } from "expo-router";
import { AnimeProvider } from "../context/AnimeContext";
import { AuthProvider } from "../context/AuthContext";
import { CategoriesProvider } from "../context/CategoriesContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AnimeProvider>
        <CategoriesProvider>
          <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </CategoriesProvider>
      </AnimeProvider>
    </AuthProvider>
  );
}
