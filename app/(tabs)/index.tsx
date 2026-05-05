import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAnime } from "@/context/AnimeContext";
import ModalImagenes from "@/components/ModalImagenes";

const PRIMARY = "#8B0000";
const PRIMARY_DARK = "#660000";
const ACCENT = "#FF6B6B";

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RESUMEN</Text>
        <Text style={styles.headerSubtitle}>Personajes consultados</Text>
      </View>

      <View style={styles.container}>
        {todosPersonajes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No se han consultado personajes aun</Text>
            <Text style={styles.emptyHint}>Usa las pestañas para buscar personajes</Text>
          </View>
        ) : (
          <>
            {saints && (
              <View style={[styles.card, { borderLeftColor: "#DAA520" }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.animeTitle, { color: "#DAA520" }]}>Saint Seiya</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardName}>{saints.nombre.toUpperCase()}</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Descripcion</Text>
                    <Text style={styles.infoValue}>{saints.descripcion}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Habilidades</Text>
                    <Text style={styles.infoValue}>{saints.habilidades}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Imagenes</Text>
                    <Text style={styles.infoValue}>{saints.imagenes.length} recuperadas</Text>
                  </View>
                </View>
              </View>
            )}

            {hunters && (
              <View style={[styles.card, { borderLeftColor: "#228B22" }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.animeTitle, { color: "#228B22" }]}>Hunter x Hunter</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardName}>{hunters.nombre.toUpperCase()}</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Descripcion</Text>
                    <Text style={styles.infoValue}>{hunters.descripcion}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Habilidades</Text>
                    <Text style={styles.infoValue}>{hunters.habilidades}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Imagenes</Text>
                    <Text style={styles.infoValue}>{hunters.imagenes.length} recuperadas</Text>
                  </View>
                </View>
              </View>
            )}

            {pirates && (
              <View style={[styles.card, { borderLeftColor: "#1E90FF" }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.animeTitle, { color: "#1E90FF" }]}>One Piece</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardName}>{pirates.nombre.toUpperCase()}</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Descripcion</Text>
                    <Text style={styles.infoValue}>{pirates.descripcion}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Habilidades</Text>
                    <Text style={styles.infoValue}>{pirates.habilidades}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Imagenes</Text>
                    <Text style={styles.infoValue}>{pirates.imagenes.length} recuperadas</Text>
                  </View>
                </View>
              </View>
            )}

            {todasImagenes.length > 0 && (
              <Pressable style={styles.imagesButton} onPress={() => setMostrarModal(true)}>
                <Text style={styles.imagesButtonText}>Ver todas las imagenes ({todasImagenes.length})</Text>
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
  emptyState: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyHint: {
    color: "#ffaaaa",
    fontSize: 14,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    marginBottom: 16,
    overflow: "hidden",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  cardHeader: {
    padding: 12,
    paddingBottom: 8,
  },
  animeTitle: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cardBody: {
    padding: 16,
    paddingTop: 8,
  },
  cardName: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    textTransform: "uppercase",
    color: "#333",
  },
  infoRow: {
    marginBottom: 10,
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
    backgroundColor: PRIMARY_DARK,
    borderRadius: 12,
    paddingHorizontal: 40,
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  imagesButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
