import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  count?: number;
  theme?: "primary";
  onPress?: () => void;
};

export default function Button({ label, count, theme, onPress }: Props) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={[styles.button, theme === "primary" && styles.primaryButton]}
        onPress={onPress}
      >
        <Text style={styles.buttonLabel}>{label}</Text>
        {count !== undefined && <Text style={styles.textConteo}>{count}</Text>}
      </Pressable>
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
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primaryButton: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  },
});
