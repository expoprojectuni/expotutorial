import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      <Link href="/contact" style={styles.button}>
        Go to Contact
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
