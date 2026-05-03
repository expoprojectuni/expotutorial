import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="saint-seiya" options={{ title: "Saint Seiya" }} />
      <Tabs.Screen name="hunter-x-hunter" options={{ title: "Hunter x Hunter" }} />
      <Tabs.Screen name="one-piece" options={{ title: "One Piece" }} />
      <Tabs.Screen name="index" options={{ title: "Resumen" }} />
    </Tabs>
  );
}
