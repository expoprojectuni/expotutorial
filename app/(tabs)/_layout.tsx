import { Tabs } from "expo-router";

const BG = "#0A0E1A";
const BORDER = "#2A3458";
const TEXT_MUTED = "#5A6285";
const NEON_PURPLE = "#B14EFF";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: BG,
          borderTopColor: BORDER,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: NEON_PURPLE,
        tabBarInactiveTintColor: TEXT_MUTED,
        tabBarLabelStyle: {
          fontSize: 11,
          letterSpacing: 1.5,
          fontWeight: "500",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="saint-seiya" options={{ title: "saints" }} />
      <Tabs.Screen name="hunter-x-hunter" options={{ title: "hunters" }} />
      <Tabs.Screen name="one-piece" options={{ title: "pirates" }} />
      <Tabs.Screen name="index" options={{ title: "resumen" }} />
    </Tabs>
  );
}
