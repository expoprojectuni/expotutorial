import LogoutButton from "@/components/LogoutButton";
import ModalImagenes from "@/components/ModalImagenes";
import { Personaje, useAnime } from "@/context/AnimeContext";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://new-back-animes.onrender.com/api";

const BG = "#0A0E1A";
const SURFACE = "#141A2E";
const BORDER = "#2A3458";
const TEXT = "#E8EAF6";
const TEXT_DIM = "#8A93B8";
const TEXT_MUTED = "#5A6285";
const ACCENT = "#3DDDFF";
const ACCENT_SOFT = "#3DDDFF22";

const PERSONAJES_DISPONIBLES = [
  "Portgas D. Ace", "Boa Hancock", "Kaido", "Big Mom", "Dracule Mihawk",
  "Donquixote Doflamingo", "Jinbe", "Yamato", "Eustass Kid", "Sabo"
];

export default function OnePieceScreen() {
  const [nombre, setNombre] = useState("");
  const { personajes, agregarPersonaje, eliminarPersonaje } = useAnime();
  const [error, setError] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [imagenesModal, setImagenesModal] = useState<string[]>([]);

  const anime = "one-piece";
  const lista = personajes[anime];

  const consultarPersonaje = async () => {
    if (!nombre.trim()) return;
    setError("");
    setMostrarModal(false);
    try {
      const res = await fetch(`${API_URL}/${anime}/${encodeURIComponent(nombre.toLowerCase().trim())}`);
      if (!res.ok) throw new Error("Personaje no encontrado");
      const data: Personaje = await res.json();
      agregarPersonaje(anime, data);
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
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.eyebrow}>{"// serie 03"}</Text>
          <LogoutButton />
        </View>
        <Text style={styles.headerTitle}>one piece</Text>
        <View style={styles.accentLine} />
        <Text style={styles.headerSubtitle}>el tesoro más grande</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>nombre del personaje</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="ej: portgas d. ace, boa hancock, sabo..."
            placeholderTextColor={TEXT_MUTED}
          />
        </View>

        <Pressable style={styles.button} onPress={consultarPersonaje}>
          <Text style={styles.buttonText}>▸ consultar</Text>
        </Pressable>

        {error !== "" && (
          <View style={styles.errorBox}>
            <Text style={styles.errorGlyph}>!</Text>
            <Text style={styles.error}>{error}</Text>
          </View>
        )}

        {lista.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              {"› consultados "}
              <Text style={styles.sectionCount}>({lista.length})</Text>
            </Text>
            {lista
              .slice()
              .reverse()
              .map((personaje, idx) => (
                <View key={personaje.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <Text style={styles.cardTag}>
                      {String(lista.length - idx).padStart(2, "0")}
                    </Text>
                    <View style={styles.dot} />
                    <Text style={styles.cardLabel}>
                      {idx === 0 ? "último" : "consulta"}
                    </Text>
                    <Pressable
                      hitSlop={8}
                      style={styles.cardRemove}
                      onPress={() => eliminarPersonaje(anime, personaje.id)}
                    >
                      <Text style={styles.cardRemoveText}>quitar</Text>
                    </Pressable>
                  </View>
                  <Text style={styles.cardTitle}>{personaje.nombre.toLowerCase()}</Text>
                  <View style={styles.divider} />
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>descripción</Text>
                    <Text style={styles.infoValue}>{personaje.descripcion}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>habilidades</Text>
                    <Text style={styles.infoValue}>{personaje.habilidades}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>imágenes</Text>
                    <Text style={[styles.infoValue, { color: ACCENT }]}>
                      {personaje.imagenes.length} recuperadas
                    </Text>
                  </View>

                  {personaje.imagenes.length > 0 && (
                    <Pressable
                      style={styles.imagesButton}
                      onPress={() => {
                        setImagenesModal(personaje.imagenes);
                        setMostrarModal(true);
                      }}
                    >
                      <Text style={styles.imagesButtonText}>
                        ver imágenes ({personaje.imagenes.length})
                      </Text>
                    </Pressable>
                  )}
                </View>
              ))}
          </>
        )}

        <ModalImagenes
          visible={mostrarModal}
          imagenes={imagenesModal}
          onClose={() => setMostrarModal(false)}
        />

        <Text style={styles.sectionTitle}>{"› personajes disponibles"}</Text>
        <View style={styles.listContainer}>
          {PERSONAJES_DISPONIBLES.map((n) => (
            <Pressable
              key={n}
              style={styles.listItem}
              onPress={() => setNombre(n.toLowerCase())}
            >
              <Text style={styles.listItemText}>{n.toLowerCase()}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: BG },
  scrollContent: { flexGrow: 1, backgroundColor: BG },
  header: {
    paddingTop: 70,
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  eyebrow: {
    color: ACCENT,
    fontSize: 12,
    letterSpacing: 3,
    marginBottom: 6,
    fontWeight: "500",
  },
  headerTitle: {
    color: TEXT,
    fontSize: 42,
    fontWeight: "300",
    letterSpacing: -1,
  },
  accentLine: {
    height: 2,
    width: 40,
    backgroundColor: ACCENT,
    marginTop: 14,
    marginBottom: 14,
  },
  headerSubtitle: {
    color: TEXT_DIM,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 60,
    backgroundColor: BG,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 18,
  },
  label: {
    color: TEXT_MUTED,
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 2,
  },
  input: {
    width: "100%",
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: TEXT,
  },
  button: {
    backgroundColor: "transparent",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: ACCENT,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginBottom: 18,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: ACCENT,
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 2,
  },
  errorBox: {
    backgroundColor: ACCENT_SOFT,
    borderLeftWidth: 2,
    borderLeftColor: ACCENT,
    borderRadius: 2,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  errorGlyph: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: "700",
  },
  error: {
    color: TEXT,
    fontSize: 13,
    fontWeight: "400",
  },
  card: {
    backgroundColor: SURFACE,
    borderRadius: 4,
    width: "100%",
    marginBottom: 16,
    padding: 18,
    borderLeftWidth: 2,
    borderLeftColor: ACCENT,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: BORDER,
    borderRightColor: BORDER,
    borderBottomColor: BORDER,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  cardTag: {
    color: ACCENT,
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: "500",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ACCENT,
  },
  cardLabel: {
    color: TEXT_MUTED,
    fontSize: 11,
    letterSpacing: 2,
  },
  cardTitle: {
    color: TEXT,
    fontSize: 26,
    fontWeight: "300",
    letterSpacing: -0.5,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: BORDER,
    marginVertical: 14,
  },
  infoRow: { marginBottom: 12 },
  infoLabel: {
    color: TEXT_MUTED,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: 4,
  },
  infoValue: {
    color: TEXT,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "300",
  },
  imagesButton: {
    backgroundColor: "transparent",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 14,
    marginTop: 6,
    alignItems: "center",
  },
  imagesButtonText: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 1.5,
  },
  sectionCount: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  cardRemove: {
    marginLeft: "auto",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 2,
  },
  cardRemoveText: {
    color: TEXT_MUTED,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  sectionTitle: {
    color: TEXT_DIM,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 14,
    letterSpacing: 2,
    alignSelf: "flex-start",
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    gap: 8,
  },
  listItem: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 2,
  },
  listItemText: {
    color: TEXT_DIM,
    fontSize: 12,
    fontWeight: "400",
    letterSpacing: 0.5,
  },
});
