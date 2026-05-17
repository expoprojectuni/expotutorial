import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { Alert, Platform, Pressable, StyleSheet, Text } from "react-native";

const BORDER = "#2A3458";
const SURFACE = "#141A2E";
const TEXT_DIM = "#8A93B8";
const DANGER = "#FF2E93";

export default function LogoutButton() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const cerrar = () => {
    logout();
    router.replace("/login");
  };

  const confirmar = () => {
    const mensaje = `¿salir de la sesión de ${user.displayName}?`;
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm(mensaje)) {
        cerrar();
      }
      return;
    }
    Alert.alert("cerrar sesión", mensaje, [
      { text: "cancelar", style: "cancel" },
      { text: "cerrar sesión", style: "destructive", onPress: cerrar },
    ]);
  };

  return (
    <Pressable hitSlop={8} style={styles.button} onPress={confirmar}>
      <Text style={styles.text}>{user.displayName} · salir</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 2,
    backgroundColor: SURFACE,
  },
  text: {
    color: TEXT_DIM,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: "500",
  },
});

export const LOGOUT_DANGER = DANGER;
