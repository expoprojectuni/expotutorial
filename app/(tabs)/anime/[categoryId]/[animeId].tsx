import ModalImagenes from "@/components/ModalImagenes";
import { useCategories } from "@/context/CategoriesContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const BG = "#0A0E1A";
const SURFACE = "#141A2E";
const SURFACE_ALT = "#1B2238";
const BORDER = "#2A3458";
const TEXT = "#E8EAF6";
const TEXT_DIM = "#8A93B8";
const TEXT_MUTED = "#5A6285";
const NEON_PURPLE = "#B14EFF";

export default function AnimeDetalleScreen() {
  const router = useRouter();
  const { categoryId, animeId } = useLocalSearchParams<{
    categoryId: string;
    animeId: string;
  }>();
  const { obtenerCategoria, obtenerAnime, loading, error: errorGlobal, refrescar } =
    useCategories();
  const [mostrarGaleria, setMostrarGaleria] = useState(false);

  const categoria = obtenerCategoria(categoryId ?? "");
  const anime = obtenerAnime(categoryId ?? "", animeId ?? "");

  if (!categoria || !anime) {
    if (loading) {
      return (
        <View style={styles.notFound}>
          <Text style={styles.notFoundGlyph}>◇</Text>
          <Text style={styles.notFoundText}>cargando anime...</Text>
        </View>
      );
    }
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundGlyph}>◇</Text>
        <Text style={styles.notFoundText}>
          {errorGlobal ?? "anime no encontrado"}
        </Text>
        {errorGlobal && (
          <Pressable
            style={[styles.backButton, { marginBottom: 10 }]}
            onPress={() => refrescar()}
          >
            <Text style={styles.backButtonText}>▸ reintentar</Text>
          </Pressable>
        )}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>▸ volver</Text>
        </Pressable>
      </View>
    );
  }

  const portada = anime.imagenes[0];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Pressable style={styles.headerBack} onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.headerBackText}>‹ volver</Text>
        </Pressable>
        <Text style={styles.eyebrow}>{`// ${categoria.nombre.toLowerCase()}`}</Text>
        <Text style={styles.headerTitle}>{anime.titulo.toLowerCase()}</Text>
        <View style={styles.accentLine} />
        {anime.genero !== "" && (
          <Text style={styles.headerSubtitle}>{anime.genero}</Text>
        )}
      </View>

      {portada && (
        <View style={styles.portadaWrapper}>
          <Image source={{ uri: portada }} style={styles.portada} resizeMode="cover" />
          <View style={styles.portadaOverlay} />
        </View>
      )}

      <View style={styles.container}>
        <View style={styles.statsRow}>
          <Stat label="episodios" value={anime.episodios || "—"} />
          <Stat label="estado" value={anime.estado || "—"} />
          <Stat label="imágenes" value={String(anime.imagenes.length)} />
        </View>

        {anime.descripcion !== "" && (
          <Info label="descripción" value={anime.descripcion} />
        )}
        {anime.estudio !== "" && <Info label="estudio" value={anime.estudio} />}
        {anime.notas !== "" && <Info label="notas personales" value={anime.notas} />}

        {anime.imagenes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{"› galería"}</Text>
            <View style={styles.grid}>
              {anime.imagenes.map((url, i) => (
                <Pressable
                  key={`${url}-${i}`}
                  style={styles.gridItem}
                  onPress={() => setMostrarGaleria(true)}
                >
                  <Image source={{ uri: url }} style={styles.gridImage} resizeMode="cover" />
                  <Text style={styles.gridLabel}>
                    <Text style={styles.gridLabelDim}>img / </Text>
                    {String(i + 1).padStart(2, "0")}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={styles.galeriaButton}
              onPress={() => setMostrarGaleria(true)}
            >
              <Text style={styles.galeriaButtonText}>▸ ver galería completa</Text>
              <Text style={styles.galeriaButtonCount}>{anime.imagenes.length}</Text>
            </Pressable>
          </>
        )}

        <Pressable
          style={styles.backToCategoryButton}
          onPress={() => router.push(`/categoria/${categoria.id}`)}
        >
          <Text style={styles.backToCategoryText}>
            ▸ ver categoría "{categoria.nombre.toLowerCase()}"
          </Text>
        </Pressable>
      </View>

      <ModalImagenes
        visible={mostrarGaleria}
        imagenes={anime.imagenes}
        onClose={() => setMostrarGaleria(false)}
      />
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: BG },
  scrollContent: { flexGrow: 1, backgroundColor: BG },
  header: {
    paddingTop: 70,
    paddingBottom: 28,
    paddingHorizontal: 24,
    backgroundColor: BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerBack: { marginBottom: 14, alignSelf: "flex-start" },
  headerBackText: {
    color: TEXT_DIM,
    fontSize: 12,
    letterSpacing: 1.5,
    fontWeight: "500",
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
    fontSize: 36,
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
  portadaWrapper: {
    width: "100%",
    height: 220,
    backgroundColor: SURFACE,
    position: "relative",
  },
  portada: { width: "100%", height: "100%" },
  portadaOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(10,14,26,0.25)",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 60,
    backgroundColor: BG,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  statPill: {
    flex: 1,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  statValue: {
    color: TEXT,
    fontSize: 18,
    fontWeight: "300",
    letterSpacing: -0.3,
  },
  statLabel: {
    color: TEXT_MUTED,
    fontSize: 10,
    letterSpacing: 1.8,
    marginTop: 2,
  },
  infoRow: { marginBottom: 18 },
  infoLabel: {
    color: TEXT_MUTED,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: 6,
  },
  infoValue: {
    color: TEXT,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "300",
  },
  sectionTitle: {
    color: TEXT_DIM,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    marginBottom: 14,
    letterSpacing: 2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  gridItem: {
    width: "48%",
    backgroundColor: SURFACE_ALT,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 8,
  },
  gridImage: {
    width: "100%",
    height: 130,
    borderRadius: 2,
    backgroundColor: BG,
  },
  gridLabel: {
    color: TEXT,
    fontSize: 11,
    marginTop: 6,
    fontWeight: "500",
    letterSpacing: 1.5,
    textAlign: "center",
  },
  gridLabelDim: {
    color: TEXT_MUTED,
    fontWeight: "400",
  },
  galeriaButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 4,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginTop: 4,
    width: "100%",
    borderWidth: 1,
    borderColor: NEON_PURPLE,
  },
  galeriaButtonText: {
    color: NEON_PURPLE,
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 1.5,
  },
  galeriaButtonCount: {
    color: NEON_PURPLE,
    fontSize: 14,
    fontWeight: "700",
  },
  backToCategoryButton: {
    marginTop: 22,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    alignItems: "center",
  },
  backToCategoryText: {
    color: TEXT_DIM,
    fontSize: 12,
    letterSpacing: 1.5,
    fontWeight: "500",
  },
  notFound: {
    flex: 1,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  notFoundGlyph: { color: NEON_PURPLE, fontSize: 48, marginBottom: 16 },
  notFoundText: { color: TEXT, fontSize: 16, marginBottom: 22 },
  backButton: {
    borderWidth: 1,
    borderColor: NEON_PURPLE,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 4,
  },
  backButtonText: {
    color: NEON_PURPLE,
    fontSize: 13,
    letterSpacing: 2,
    fontWeight: "500",
  },
});
