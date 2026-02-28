import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Contact() {
  return (
    <View style={styles.container}>
      <Text>Pantalla de contacto</Text>
      <Link href="/">Volver a la pantalla de inici</Link>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    marginTop: 20,
  },
});
