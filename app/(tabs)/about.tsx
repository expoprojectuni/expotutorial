import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AboutScreen() {
  const [nombre, setNombre] = useState("");
  const [pokemon, setPokemon] = useState<any>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const consultar = async () => {
    if (!nombre.trim()) return;
    setCargando(true);
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
    } finally {
      setCargando(false);
    }
  };

  const tipos = pokemon?.types?.map((t: any) => t.type.name).join(", ");

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

      {cargando && (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ marginTop: 20 }}
        />
      )}
      {error !== "" && <Text style={styles.error}>{error}</Text>}

      {pokemon && (
        <View style={styles.card}>
          {pokemon.sprites?.back_default && (
            <Image
              source={{ uri: pokemon.sprites.back_default }}
              style={styles.image}
            />
          )}
          <Text style={styles.infoLabel}>imagen espaldas</Text>

          {pokemon.sprites?.front_shiny && (
            <Image
              source={{ uri: pokemon.sprites.front_shiny }}
              style={styles.image}
            />
          )}
          <Text style={styles.infoLabel}>imagen shiny</Text>

          <Text style={styles.infoValue}>
            peso pokemon: {pokemon.weight / 10} kg
          </Text>
          <Text style={styles.infoValue}>tipos de pokemon: {tipos}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
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
    width: 100,
    height: 100,
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
  error: {
    color: "#ff4444",
    marginTop: 10,
    fontSize: 15,
  },
});
