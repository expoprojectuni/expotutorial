import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAnime } from "@/context/AnimeContext";
import ModalImagenes from "@/components/ModalImagenes";

const BG = "#0A0E1A";
const SURFACE = "#141A2E";
const BORDER = "#2A3458";
const TEXT = "#E8EAF6";
const TEXT_DIM = "#8A93B8";
const TEXT_MUTED = "#5A6285";
const NEON_PURPLE = "#B14EFF";
const SAINT = "#FF2E93";
const HUNTER = "#7CFF6B";
const PIRATE = "#3DDDFF";

export default function ResumenScreen() {
  const { personajes } = useAnime();
  const [mostrarModal, setMostrarModal] = useState(false);

  const saints = personajes["saint-seiya"];
  const hunters = personajes["hunter-x-hunter"];
  const pirates = personajes["one-piece"];

  const todosPersonajes = [saints, hunters, pirates].filter(Boolean);
  const todasImagenes = todosPersonajes.flatMap((p) => (p ? p.imagenes : []));

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{"// dashboard"}</Text>
        <Text style={styles.headerTitle}>resumen</Text>
        <View style={styles.accentLine} />
        <Text style={styles.headerSubtitle}>personajes consultados en sesión</Text>
      </View>

      <View style={styles.container}>
        {todosPersonajes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyGlyph}>◇</Text>
            <Text style={styles.emptyText}>sin consultas todavía</Text>
            <Text style={styles.emptyHint}>navega a las pestañas para buscar personajes</Text>
          </View>
        ) : (
          <>
            <View style={styles.statsRow}>
              <StatPill label="series" value={String(todosPersonajes.length)} />
              <StatPill label="imágenes" value={String(todasImagenes.length)} />
            </View>

            {saints && <PersonajeCard data={saints} accent={SAINT} label="saint seiya" tag="01" />}
            {hunters && <PersonajeCard data={hunters} accent={HUNTER} label="hunter x hunter" tag="02" />}
            {pirates && <PersonajeCard data={pirates} accent={PIRATE} label="one piece" tag="03" />}

            {todasImagenes.length > 0 && (
              <Pressable style={styles.imagesButton} onPress={() => setMostrarModal(true)}>
                <Text style={styles.imagesButtonText}>▸ ver galería completa</Text>
                <Text style={styles.imagesButtonCount}>{todasImagenes.length}</Text>
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

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function PersonajeCard({
  data,
  accent,
  label,
  tag,
}: {
  data: { nombre: string; descripcion: string; habilidades: string; imagenes: string[] };
  accent: string;
  label: string;
  tag: string;
}) {
  return (
    <View style={[styles.card, { borderColor: accent }]}>
      <View style={styles.cardTop}>
        <Text style={[styles.cardTag, { color: accent }]}>{tag}</Text>
        <Text style={[styles.cardLabel, { color: accent }]}>{label}</Text>
      </View>
      <Text style={styles.cardName}>{data.nombre.toLowerCase()}</Text>
      <View style={[styles.divider, { backgroundColor: accent + "30" }]} />
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>descripción</Text>
        <Text style={styles.infoValue}>{data.descripcion}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>habilidades</Text>
        <Text style={styles.infoValue}>{data.habilidades}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>imágenes</Text>
        <Text style={[styles.infoValue, { color: accent }]}>{data.imagenes.length} recuperadas</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: BG,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: BG,
  },
  header: {
    paddingTop: 70,
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  eyebrow: {
    color: NEON_PURPLE,
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
    backgroundColor: NEON_PURPLE,
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
  emptyState: {
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 20,
  },
  emptyGlyph: {
    color: NEON_PURPLE,
    fontSize: 48,
    marginBottom: 20,
  },
  emptyText: {
    color: TEXT,
    fontSize: 17,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  emptyHint: {
    color: TEXT_MUTED,
    fontSize: 13,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statPill: {
    flex: 1,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  statValue: {
    color: TEXT,
    fontSize: 28,
    fontWeight: "200",
    letterSpacing: -0.5,
  },
  statLabel: {
    color: TEXT_MUTED,
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 2,
  },
  card: {
    backgroundColor: SURFACE,
    borderRadius: 4,
    width: "100%",
    marginBottom: 14,
    padding: 18,
    borderLeftWidth: 2,
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
    marginBottom: 8,
  },
  cardTag: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  cardLabel: {
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: "500",
  },
  cardName: {
    fontSize: 24,
    fontWeight: "300",
    color: TEXT,
    letterSpacing: -0.5,
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 14,
  },
  infoRow: {
    marginBottom: 12,
  },
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 4,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginTop: 8,
    width: "100%",
    borderWidth: 1,
    borderColor: NEON_PURPLE,
  },
  imagesButtonText: {
    color: NEON_PURPLE,
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 1.5,
  },
  imagesButtonCount: {
    color: NEON_PURPLE,
    fontSize: 14,
    fontWeight: "700",
  },
});
