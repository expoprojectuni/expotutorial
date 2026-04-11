import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { usePokemon } from "../../context/PokemonContext";

export default function Index() {
  const [nombre, setNombre] = useState("");
  const { pokemon, setPokemon } = usePokemon();
  const [error, setError] = useState("");

  const consultar = async () => {
    if (!nombre.trim()) return;
    setError("");
    setPokemon(null);
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase().trim()}`,
      );
      if (!res.ok) throw new Error("Pokémon no encontrado");
      const data = await res.json();
      setPokemon(data);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const habilidades = pokemon?.abilities
    ?.map((a: any) => a.ability.name)
    .join(", ");

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Digite nombre de pokemon</Text>

      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Pikachu"
        placeholderTextColor="#aaa"
      />

      <Pressable style={styles.button} onPress={consultar}>
        <Text style={styles.buttonText}>Consultar</Text>
      </Pressable>

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      {pokemon && (
        <View style={styles.card}>
          {pokemon.sprites?.front_default && (
            <Image
              source={{ uri: pokemon.sprites.front_default }}
              style={styles.image}
              resizeMode="contain"
            />
          )}
          <Text style={styles.infoLabel}>imagen frontal</Text>
          <Text style={styles.infoValue}>
            altura pokemon:{" "}
            {pokemon.height / 10 < 1
              ? `${pokemon.height * 10} centrimetos`
              : `${pokemon.height / 10} metros`}
          </Text>
          <Text style={styles.infoValue}>habilidades: {habilidades}</Text>
        </View>
      )}
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
  label: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  button: {
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
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
    marginTop: 8,
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
  error: {
    color: "black",
    marginTop: 10,
    fontSize: 15,
  },
});
