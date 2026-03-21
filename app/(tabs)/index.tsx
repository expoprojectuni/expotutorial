import { Pressable, StyleSheet, Text, View } from "react-native";
import { useCounter } from "../../context/CounterContext"; // 👈 importas el hook

export default function Index() {
  const { count, increment } = useCounter(); // 👈 ya no hay useState

  return (
    <View style={styles.container}>
      <Pressable onPress={increment}>
        {" "}
        {/* 👈 llamas increment del context */}
        <Text style={styles.textIncrement}>Incrementar</Text>
        <Text style={styles.textConteo}>{count}</Text>
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
    backgroundColor: "#347ad0ff",
    alignItems: "center",
    justifyContent: "center",
  },
  textIncrement: {
    color: "black",
    borderRadius: 5,
    backgroundColor: "red",
    padding: 10,
  },
  textDecrement: {
    color: "#ffffff19",
  },
  textConteo: {
    color: "black",
  },

  imageContainer: {
    marginTop: 100,
    flex: 1,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
    paddingTop: 100,
  },

  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
});
