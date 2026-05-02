import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { usePokemon } from "../../context/PokemonContext";
import ModalImagenes from "../../components/ModalImagenes";

interface ImagenInfo {
  uri: string | null;
  label: string;
  encontrado: boolean;
}

export default function Index() {
  const [nombre, setNombre] = useState("");
  const { pokemon, setPokemon, cantidadImagenes, setCantidadImagenes } = usePokemon();
  const [error, setError] = useState("");
  const [source, setSource] = useState<"local" | "internet" | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [imagenesError, setImagenesError] = useState<string[]>([]);
  const [imagenes, setImagenes] = useState<ImagenInfo[]>([]);

  const construirImagenes = (): ImagenInfo[] => {
    if (source === "internet" && pokemon) {
      const s = pokemon.sprites || {};

      return [
        { uri: s.front_default, label: "Frontal", encontrado: !!s.front_default },
        { uri: s.back_default, label: "Posterior", encontrado: !!s.back_default },
        { uri: s.front_shiny, label: "Shiny Frontal", encontrado: !!s.front_shiny },
        { uri: s.back_shiny, label: "Shiny Posterior", encontrado: !!s.back_shiny },
        { uri: s.front_female, label: "Frontal Hembra", encontrado: !!s.front_female },
        { uri: s.back_female, label: "Posterior Hembra", encontrado: !!s.back_female },
        { uri: s.front_shiny_female, label: "Shiny Frontal Hembra", encontrado: !!s.front_shiny_female },
        { uri: s.back_shiny_female, label: "Shiny Posterior Hembra", encontrado: !!s.back_shiny_female },
          ];
    }

    if (source === "local" && pokemon) {
      return [
        { uri: pokemon.imagen_frontal || null, label: "Frontal", encontrado: !!pokemon.imagen_frontal },
        { uri: pokemon.imagen_posterior || null, label: "Posterior", encontrado: !!pokemon.imagen_posterior },
        { uri: pokemon.imagen_shiny || null, label: "Shiny", encontrado: !!pokemon.imagen_shiny },
        { uri: pokemon.imagen_shiny_posterior || null, label: "Shiny Posterior", encontrado: !!pokemon.imagen_shiny_posterior },
      ];
    }

    return [];
  };

  const contarImagenes = (p: any, src: "local" | "internet"): number => {
    if (src === "internet") {
      const s = p.sprites || {};


      const allUrls = [
        s.front_default, s.back_default, s.front_shiny, s.back_shiny,
        s.front_female, s.back_female, s.front_shiny_female, s.back_shiny_female,
      
      ];
      return allUrls.filter(Boolean).length;
    }
    if (src === "local") {
      return [
        p.imagen_frontal, p.imagen_posterior, p.imagen_shiny, p.imagen_shiny_posterior,
      ].filter(Boolean).length;
    }
    return 0;
  };

  const consultarLocal = async () => {
    if (!nombre.trim()) return;
    setError("");
    setPokemon(null);
    setSource("local");
    setMostrarModal(false);
    setImagenesError([]);
    setImagenes([]);
    setCantidadImagenes(0);
    try {
      const res = await fetch(
        `http://localhost:3000/api/pokemon/${nombre.toLowerCase().trim()}`,
      );
      if (!res.ok) throw new Error("Pokémon no encontrado");
      const data = await res.json();
      setPokemon(data);
      setCantidadImagenes(contarImagenes(data, "local"));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const consultarInternet = async () => {
    if (!nombre.trim()) return;
    setError("");
    setPokemon(null);
    setSource("internet");
    setMostrarModal(false);
    setImagenesError([]);
    setImagenes([]);
    setCantidadImagenes(0);
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase().trim()}`,
      );
      if (!res.ok) throw new Error("Pokémon no encontrado en PokéAPI");
      const data = await res.json();
      setPokemon(data);
      setCantidadImagenes(contarImagenes(data, "internet"));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const verImagenes = () => {
    setError("");
    setImagenesError([]);
    const imgs = construirImagenes();
    const encontradas = imgs.filter((img) => img.encontrado);
    const noEncontradas = imgs.filter((img) => !img.encontrado);

    if (encontradas.length === 0) {
      setImagenesError(["Ninguna imagen encontrada para este Pokémon"]);
    }

    setCantidadImagenes(encontradas.length);
    setImagenes(imgs);
    setMostrarModal(true);
  };

  const tipos = source === "internet"
    ? pokemon?.types?.map((t: any) => t.type.name).join(", ")
    : pokemon?.tipos?.join(", ");

  const altura = source === "internet"
    ? `${pokemon?.height / 10} m`
    : pokemon?.altura != null
      ? `${pokemon.altura / 10} m`
      : null;

  const peso = source === "internet"
    ? `${pokemon?.weight / 10} kg`
    : pokemon?.peso != null
      ? `${pokemon.peso / 10} kg`
      : null;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.label}>Digite nombre de pokemon</Text>

        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Pikachu"
          placeholderTextColor="#aaa"
        />

        <View style={styles.buttonRow}>
          <Pressable style={styles.button} onPress={consultarLocal}>
            <Text style={styles.buttonText}>Buscar Local</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={consultarInternet}>
            <Text style={styles.buttonText}>Buscar Internet</Text>
          </Pressable>
        </View>

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        {pokemon && (
          <>
            <View style={styles.card}>
              {source && (
                <Text style={styles.sourceLabel}>
                  Fuente: {source === "local" ? "Base de datos local" : "PokéAPI"}
                </Text>
              )}
              <Text style={styles.pokemonName}>
                {source === "internet" ? pokemon.name?.toUpperCase() : pokemon.nombre?.toUpperCase()}
              </Text>
              {altura && <Text style={styles.infoValue}>altura: {altura}</Text>}
              {peso && <Text style={styles.infoValue}>peso: {peso}</Text>}
              {tipos && <Text style={styles.infoValue}>tipos: {tipos}</Text>}
              <Text style={styles.infoValue}>
                imágenes encontradas: {cantidadImagenes}
              </Text>
            </View>

            <Pressable style={[styles.button, styles.verImagenesBtn]} onPress={verImagenes}>
              <Text style={styles.buttonText}>Ver Imágenes</Text>
            </Pressable>
          </>
        )}

        <ModalImagenes
          visible={mostrarModal}
          imagenes={imagenes}
          source={source}
          imagenesError={imagenesError}
          onClose={() => setMostrarModal(false)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
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
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  button: {
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  verImagenesBtn: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: "#ffffff33",
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
    marginBottom: 12,
  },
  pokemonName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  sourceLabel: {
    fontSize: 12,
    color: "#444",
    fontStyle: "italic",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#333",
    padding: 6,
    marginBottom: 12,
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
    color: "#b00",
    marginTop: 4,
    fontSize: 14,
    fontWeight: "bold",
  },
});
