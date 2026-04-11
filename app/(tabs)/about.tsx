import { Image, StyleSheet, Text, View } from "react-native";
import { usePokemon } from "../../context/PokemonContext";

export default function AboutScreen() {
  const { pokemon } = usePokemon();

  const tipos = pokemon?.types?.map((t: any) => t.type.name).join(", ");

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {pokemon?.sprites?.back_default && (
          <Image
            source={{ uri: pokemon.sprites.back_default }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
        <Text style={styles.infoLabel}>imagen espaldas</Text>

        {pokemon?.sprites?.front_shiny && (
          <Image
            source={{ uri: pokemon.sprites.front_shiny }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
        <Text style={styles.infoLabel}>imagen shiny</Text>

        <Text style={styles.infoValue}>
          peso pokemon:{" "}
          {pokemon
            ? `${pokemon.weight / 10 < 1 ? `${pokemon.weight} gramos` : `${pokemon.weight / 10} kilogramos`}`
            : ""}
        </Text>
        <Text style={styles.infoValue}>tipos de pokemon: {tipos}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  aviso: {
    color: "#aaa",
    fontSize: 16,
    marginTop: 40,
  },
  card: {
    backgroundColor: "#ffffffcc",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: 120,
    height: 120,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#333",
    padding: 6,
    marginTop: 4,
    width: "80%",
    textAlign: "center",
    borderRadius: 4,
  },
  infoValue: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#333",
    padding: 6,
    marginTop: 6,
    width: "80%",
    textAlign: "center",
    borderRadius: 4,
  },
});
