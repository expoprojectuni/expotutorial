import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAnime } from "@/context/AnimeContext";
import ModalImagenes from "@/components/ModalImagenes";

export default function ResumenScreen() {
  const { personajes } = useAnime();
  const [mostrarModal, setMostrarModal] = useState(false);

  const saints = personajes["saint-seiya"];
  const hunters = personajes["hunter-x-hunter"];
  const pirates = personajes["one-piece"];

  const todosPersonajes = [saints, hunters, pirates].filter(Boolean);
  const todasImagenes = todosPersonajes.flatMap((p) => (p ? p.imagenes : []));

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Resumen de consultas</Text>

        {todosPersonajes.length === 0 ? (
          <Text style={styles.aviso}>No se han consultado personajes aun</Text>
        ) : (
          <>
            {saints && (
              <View style={styles.card}>
                <Text style={styles.animeTitle}>Saint Seiya</Text>
                <Text style={styles.pokemonName}>{saints.nombre.toUpperCase()}</Text>
                <Text style={styles.infoValue}>Descripcion: {saints.descripcion}</Text>
                <Text style={styles.infoValue}>Habilidades: {saints.habilidades}</Text>
                <Text style={styles.infoValue}>Imagenes: {saints.imagenes.length}</Text>
              </View>
            )}

            {hunters && (
              <View style={styles.card}>
                <Text style={styles.animeTitle}>Hunter x Hunter</Text>
                <Text style={styles.pokemonName}>{hunters.nombre.toUpperCase()}</Text>
                <Text style={styles.infoValue}>Descripcion: {hunters.descripcion}</Text>
                <Text style={styles.infoValue}>Habilidades: {hunters.habilidades}</Text>
                <Text style={styles.infoValue}>Imagenes: {hunters.imagenes.length}</Text>
              </View>
            )}

            {pirates && (
              <View style={styles.card}>
                <Text style={styles.animeTitle}>One Piece</Text>
                <Text style={styles.pokemonName}>{pirates.nombre.toUpperCase()}</Text>
                <Text style={styles.infoValue}>Descripcion: {pirates.descripcion}</Text>
                <Text style={styles.infoValue}>Habilidades: {pirates.habilidades}</Text>
                <Text style={styles.infoValue}>Imagenes: {pirates.imagenes.length}</Text>
              </View>
            )}

            {todasImagenes.length > 0 && (
              <Pressable style={[styles.button, styles.verImagenesBtn]} onPress={() => setMostrarModal(true)}>
                <Text style={styles.buttonText}>Ver Imagenes ({todasImagenes.length} total)</Text>
              </Pressable>
            )}
          </>
        )}

        <ModalImagenes
          visible={mostrarModal}
          imagenes={todasImagenes}
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
    backgroundColor: "#8B0000",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
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
    marginBottom: 12,
  },
  animeTitle: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 4,
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
  button: {
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginBottom: 12,
  },
  verImagenesBtn: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: "#ffffff33",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
