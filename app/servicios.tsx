import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About screen</Text>
      <Link href="/" style={styles.button}>
        Go to Home screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#518dd7ff",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#1f9b93ff",
  },

  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#9ee057ff",
    paddingTop: 20,
    backgroundColor: "red",
    alignItems: "center",
  },
});
