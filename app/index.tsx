import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      <Link href="/about" style={styles.button}>
        Go to About screen
      </Link>
      <Link href="/servicios" style={styles.button}>
        Go to servicios screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#347ad0ff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#ffffff19",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#cfbabaff",
    paddingTop: 20,
    backgroundColor: "blue",
    alignItems: "center",
  },
});
