import { Tabs } from "expo-router";
import { CounterProvider } from "../../context/CounterContext";
import { PokemonProvider } from "../../context/PokemonContext"; // 👈 nuevo

export default function TabLayout() {
  return (
    <CounterProvider>
      <PokemonProvider>
        <Tabs>
          <Tabs.Screen name="index" options={{ title: "Incrementar" }} />
          <Tabs.Screen name="about" options={{ title: "Decrementar" }} />
        </Tabs>
      </PokemonProvider>
    </CounterProvider>
  );
}
