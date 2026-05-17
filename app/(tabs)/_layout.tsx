import CustomTabBar from "@/components/CustomTabBar";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="saint-seiya" options={{ title: "saints" }} />
      <Tabs.Screen name="hunter-x-hunter" options={{ title: "hunters" }} />
      <Tabs.Screen name="one-piece" options={{ title: "pirates" }} />
      <Tabs.Screen name="categorias" options={{ title: "categorías" }} />
      <Tabs.Screen name="index" options={{ title: "resumen" }} />
      <Tabs.Screen name="categoria/[id]" options={{ href: null }} />
      <Tabs.Screen name="anime/[categoryId]/[animeId]" options={{ href: null }} />
    </Tabs>
  );
}
