import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function contact() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Contact screen</Text>
      <Link href="/" style={styles.buttonContact}>
        Devuelvase a home
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  text: {
    fontSize: 30,
    backgroundColor: "red",
  },

  buttonContact: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
});
