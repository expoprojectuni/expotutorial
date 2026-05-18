import { Pressable } from "react-native";
import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

function LogoutButton() {
  const { logout } = useAuth();
  return (
    <Pressable
      onPress={async () => {
        await logout();
        router.replace("/auth/login");
      }}
      style={{ marginRight: 16 }}
    >
      <Ionicons name="log-out-outline" size={22} color="#DC2626" />
    </Pressable>
  );
}

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="inicio"
        options={{
          title: "Inicio",
          headerRight: () => <LogoutButton />,
        }}
      />
      <Tabs.Screen name="informacion" options={{ title: "Información" }} />
    </Tabs>
  );
}
