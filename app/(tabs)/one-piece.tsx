import ModalImagenes from "@/components/ModalImagenes";
import { Personaje, useAnime } from "@/context/AnimeContext";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const API_URL = "https://pokedex-backend-production-cd5c.up.railway.app/api";
const PRIMARY = "#1E90FF";
const PRIMARY_DARK = "#1565C0";
const ACCENT = "#87CEEB";

export default function OnePieceScreen() {
  const [nombre, setNombre] = useState("");
  const { personajes, setPersonaje } = useAnime();
  const [error, setError] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [imagenesModal, setImagenesModal] = useState<string[]>([]);

  const anime = "one-piece";
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ONE PIECE</Text>
        <Text style={styles.headerSubtitle}>El tesoro mas grande</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre del personaje</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej: luffy, zoro, nami..."
            placeholderTextColor="#999"
          />
        </View>

        <Pressable style={styles.button} onPress={consultarPersonaje}>
          <Text style={styles.buttonText}>Consultar</Text>
        </Pressable>

        {error !== "" && (
          <View style={styles.errorBox}>
            <Text style={styles.error}>{error}</Text>
          </View>
        )}

        {personaje && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{personaje.nombre.toUpperCase()}</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Descripcion</Text>
                <Text style={styles.infoValue}>{personaje.descripcion}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Habilidades</Text>
                <Text style={styles.infoValue}>{personaje.habilidades}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Imagenes</Text>
                <Text style={styles.infoValue}>{personaje.imagenes.length} recuperadas</Text>
              </View>
            </View>

            {personaje.imagenes.length > 0 && (
              <Pressable style={styles.imagesButton} onPress={() => { setImagenesModal(personaje.imagenes); setMostrarModal(true); }}>
                <Text style={styles.imagesButtonText}>Ver Imagenes ({personaje.imagenes.length})</Text>
              </Pressable>
            )}
          </View>
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
  header: {
    backgroundColor: PRIMARY_DARK,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 2,
  },
  headerSubtitle: {
    color: ACCENT,
    fontSize: 14,
    marginTop: 4,
    fontStyle: "italic",
  },
  container: {
    flex: 1,
    backgroundColor: PRIMARY,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: PRIMARY_DARK,
    borderRadius: 12,
    paddingHorizontal: 40,
    paddingVertical: 14,
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  errorBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    width: "100%",
    alignItems: "center",
  },
  error: {
    color: "#e74c3c",
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  cardHeader: {
    backgroundColor: PRIMARY_DARK,
    padding: 16,
    alignItems: "center",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
  },
  cardBody: {
    padding: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    color: PRIMARY_DARK,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  infoValue: {
    color: "#333",
    fontSize: 14,
    lineHeight: 20,
  },
  imagesButton: {
    backgroundColor: PRIMARY,
    padding: 14,
    alignItems: "center",
  },
  imagesButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
