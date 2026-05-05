import ModalImagenes from "@/components/ModalImagenes";
import { Personaje, useAnime } from "@/context/AnimeContext";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const API_URL = "https://pokedex-backend-production-cd5c.up.railway.app/api";

export default function SaintSeiyaScreen() {
  const [nombre, setNombre] = useState("");
  const { personajes, setPersonaje } = useAnime();
  const [error, setError] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [imagenesModal, setImagenesModal] = useState<string[]>([]);

  const anime = "saint-seiya";
  const personaje = personajes[anime];

  const consultarPersonaje = async () => {
    if (!nombre.trim()) return;
    setError("");
    setMostrarModal(false);
    try {
      const res = await fetch(`${API_URL}/${anime}/${nombre.toLowerCase().trim()}`);
      if (!res.ok) throw new Error("Personaje no encontrado");
      const data: Personaje = await res.json();
      setPersonaje(anime, data);
      setImagenesModal(data.imagenes);
      Alert.alert(
        data.nombre.toUpperCase(),
        `Descripcion: ${data.descripcion}\nHabilidades: ${data.habilidades}\nImagenes recuperadas: ${data.imagenes.length}`,
        [
          { text: "OK" },
          ...(data.imagenes.length > 0
            ? [
                {
                  text: "Ver imagenes",
                  onPress: () => setMostrarModal(true),
                },
              ]
            : []),
        ]
      );
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.label}>Digite nombre del personaje</Text>

        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre del personaje"
          placeholderTextColor="#aaa"
        />

        <Pressable style={styles.button} onPress={consultarPersonaje}>
          <Text style={styles.buttonText}>Consultar</Text>
        </Pressable>

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        {personaje && (
          <>
            <View style={styles.card}>
              <Text style={styles.pokemonName}>{personaje.nombre.toUpperCase()}</Text>
              <Text style={styles.infoValue}>Descripcion: {personaje.descripcion}</Text>
              <Text style={styles.infoValue}>Habilidades: {personaje.habilidades}</Text>
              <Text style={styles.infoValue}>Imagenes recuperadas: {personaje.imagenes.length}</Text>
            </View>

            {personaje.imagenes.length > 0 && (
              <Pressable style={[styles.button, styles.verImagenesBtn]} onPress={() => { setImagenesModal(personaje.imagenes); setMostrarModal(true); }}>
                <Text style={styles.buttonText}>Ver Imagenes</Text>
              </Pressable>
            )}
          </>
        )}

        <ModalImagenes
          visible={mostrarModal}
          imagenes={imagenesModal}
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
    backgroundColor: "#DAA520",
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
  button: {
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginBottom: 12,
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
