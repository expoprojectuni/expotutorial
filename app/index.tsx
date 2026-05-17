import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  const { user, cargandoSesion } = useAuth();
  if (cargandoSesion) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#B14EFF" />
      </View>
    );
  }
  return <Redirect href={user ? "/(tabs)/saint-seiya" : "/login"} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "#0A0E1A",
    alignItems: "center",
    justifyContent: "center",
  },
});
