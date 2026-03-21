import { Pressable, StyleSheet, Text, View } from "react-native";
import { useCounter } from "../../context/CounterContext"; // 👈

export default function AboutScreen() {
  const { count, decrement } = useCounter(); // 👈 ya no hay useState

  return (
    <View style={styles.container}>
      <Pressable onPress={decrement}>
        {" "}
        {/* 👈 llamas decrement del context */}
        <Text style={styles.textDecrement}>Decrementar</Text>
      </Pressable>

      <View style={{ backgroundColor: "red", padding: 10 }}>
        <Text>Valor del conteo:</Text>
        <Text>{count}</Text>
      </View>
    </View>
  );
}

// styles igual que antes...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  textDecrement: {
    color: "#fff",
    borderWidth: 5,
    padding: 10,
    backgroundColor: "red",
  },

  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
    paddingTop: 20,
    backgroundColor: "blue",
    alignItems: "center",
  },
  textCount: {
    color: "#fff",
  },
});
