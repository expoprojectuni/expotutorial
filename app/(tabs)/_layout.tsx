import { Tabs } from "expo-router";
import { CounterProvider } from "../../context/CounterContext";

export default function TabLayout() {
  return (
    <CounterProvider>
      {" "}
      {/* 👈 Envuelve todo aquí */}
      <Tabs>
        <Tabs.Screen name="index" options={{ title: "Incrementar" }} />
        <Tabs.Screen name="about" options={{ title: "Decrementar" }} />
      </Tabs>
    </CounterProvider>
  );
}
