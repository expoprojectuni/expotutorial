import LogoutButton from "@/components/LogoutButton";
import { useAuth } from "@/context/AuthContext";
import { useCategories } from "@/context/CategoriesContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const BG = "#0A0E1A";
const SURFACE = "#141A2E";
const BORDER = "#2A3458";
const TEXT = "#E8EAF6";
const TEXT_DIM = "#8A93B8";
const TEXT_MUTED = "#5A6285";
const NEON_PURPLE = "#B14EFF";
const ACCENT_SOFT = "#B14EFF22";

export default function CategoriasScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    categorias,
    loading,
    error: errorGlobal,
    refrescar,
    crearCategoria,
    eliminarCategoria,
  } = useCategories();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const noAutenticado = !user;
  const errorRequiereLogin =
    error.toLowerCase().includes("no autenticado") ||
    (errorGlobal ?? "").toLowerCase().includes("no autenticado");
  const irALogin = () => router.push("/login");

  const guardar = async () => {
    if (!nombre.trim()) {
      setError("ingresa un nombre para la categoría");
      return;
    }
    const duplicado = categorias.some(
      (c) => c.nombre.toLowerCase() === nombre.trim().toLowerCase()
    );
    if (duplicado) {
      setError("ya existe una categoría con ese nombre");
      return;
    }
    setEnviando(true);
    setError("");
    try {
      await crearCategoria({ nombre, descripcion });
      setNombre("");
      setDescripcion("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "error al crear categoría");
    } finally {
      setEnviando(false);
    }
  };

  const confirmarEliminar = (id: string, nombreCat: string) => {
    Alert.alert(
      "eliminar categoría",
      `¿borrar "${nombreCat}" y todos sus animes?`,
      [
        { text: "cancelar", style: "cancel" },
        {
          text: "eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await eliminarCategoria(id);
            } catch (e) {
              Alert.alert(
                "no se pudo eliminar",
                e instanceof Error ? e.message : "error desconocido"
              );
            }
          },
        },
      ]
    );
  };

  const totalAnimes = categorias.reduce((acc, c) => acc + c.animes.length, 0);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.eyebrow}>{"// biblioteca"}</Text>
          <LogoutButton />
        </View>
        <Text style={styles.headerTitle}>categorías</Text>
        <View style={styles.accentLine} />
        <Text style={styles.headerSubtitle}>organiza tus animes en colecciones</Text>
      </View>

      <View style={styles.container}>
        {noAutenticado && (
          <View style={styles.authBanner}>
            <Text style={styles.authBannerEyebrow}>{"// acceso"}</Text>
            <Text style={styles.authBannerTitle}>usuario no autenticado</Text>
            <Text style={styles.authBannerSubtitle}>
              inicia sesión para crear y gestionar tus categorías
            </Text>
            <Pressable style={styles.authBannerButton} onPress={irALogin}>
              <Text style={styles.authBannerButtonText}>▸ iniciar sesión</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statValue}>{categorias.length}</Text>
            <Text style={styles.statLabel}>categorías</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statValue}>{totalAnimes}</Text>
            <Text style={styles.statLabel}>animes</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{"› nueva categoría"}</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>nombre</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="ej: shonen, slice of life, mecha..."
            placeholderTextColor={TEXT_MUTED}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>descripción (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="breve descripción de la categoría"
            placeholderTextColor={TEXT_MUTED}
            multiline
            numberOfLines={3}
          />
        </View>

        <Pressable
          style={[styles.button, enviando && styles.buttonDisabled]}
          onPress={guardar}
          disabled={enviando}
        >
          <Text style={styles.buttonText}>
            {enviando ? "▸ guardando..." : "▸ crear categoría"}
          </Text>
        </Pressable>

        {error !== "" && (
          <View style={styles.errorBox}>
            <Text style={styles.errorGlyph}>!</Text>
            <Text style={styles.error}>{error}</Text>
            {error.toLowerCase().includes("no autenticado") && (
              <Pressable hitSlop={8} onPress={irALogin}>
                <Text style={styles.errorLogin}>iniciar sesión</Text>
              </Pressable>
            )}
          </View>
        )}

        {errorGlobal && (
          <View style={styles.errorBox}>
            <Text style={styles.errorGlyph}>!</Text>
            <Text style={styles.error}>{errorGlobal}</Text>
            {errorRequiereLogin ? (
              <Pressable hitSlop={8} onPress={irALogin}>
                <Text style={styles.errorLogin}>iniciar sesión</Text>
              </Pressable>
            ) : (
              <Pressable hitSlop={8} onPress={() => refrescar()}>
                <Text style={styles.errorRetry}>reintentar</Text>
              </Pressable>
            )}
          </View>
        )}

        <Text style={styles.sectionTitle}>{"› mis categorías"}</Text>

        {loading && categorias.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyGlyph}>◇</Text>
            <Text style={styles.emptyText}>cargando categorías...</Text>
          </View>
        ) : categorias.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyGlyph}>◇</Text>
            <Text style={styles.emptyText}>aún no hay categorías</Text>
            <Text style={styles.emptyHint}>crea la primera con el formulario superior</Text>
          </View>
        ) : (
          categorias.map((c, i) => (
            <Pressable
              key={c.id}
              style={styles.card}
              onPress={() => router.push(`/categoria/${c.id}`)}
            >
              <View style={styles.cardTop}>
                <Text style={styles.cardTag}>{String(i + 1).padStart(2, "0")}</Text>
                <Text style={styles.cardLabel}>categoría</Text>
                <View style={styles.dot} />
                <Text style={styles.cardCount}>{c.animes.length} animes</Text>
              </View>
              <Text style={styles.cardName}>{c.nombre.toLowerCase()}</Text>
              {c.descripcion !== "" && (
                <Text style={styles.cardDescription}>{c.descripcion}</Text>
              )}
              <View style={styles.cardFooter}>
                <Text style={styles.cardOpen}>▸ abrir</Text>
                <Pressable
                  hitSlop={10}
                  onPress={() => confirmarEliminar(c.id, c.nombre)}
                >
                  <Text style={styles.cardDelete}>eliminar</Text>
                </Pressable>
              </View>
            </Pressable>
          ))
        )}
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
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
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
  sectionTitle: {
    color: TEXT_DIM,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 8,
    marginBottom: 14,
    letterSpacing: 2,
  },
  inputContainer: { width: "100%", marginBottom: 14 },
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
  textarea: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "transparent",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: NEON_PURPLE,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 6,
    marginBottom: 18,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: NEON_PURPLE,
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 2,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  errorRetry: {
    color: NEON_PURPLE,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
    marginLeft: "auto",
  },
  errorLogin: {
    color: NEON_PURPLE,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginLeft: "auto",
  },
  authBanner: {
    backgroundColor: SURFACE,
    borderLeftWidth: 2,
    borderLeftColor: NEON_PURPLE,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: BORDER,
    borderRightColor: BORDER,
    borderBottomColor: BORDER,
    borderRadius: 4,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  authBannerEyebrow: {
    color: NEON_PURPLE,
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: "500",
    marginBottom: 6,
  },
  authBannerTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: "400",
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  authBannerSubtitle: {
    color: TEXT_DIM,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  authBannerButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: NEON_PURPLE,
    borderRadius: 4,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  authBannerButtonText: {
    color: NEON_PURPLE,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
  },
  errorBox: {
    backgroundColor: ACCENT_SOFT,
    borderLeftWidth: 2,
    borderLeftColor: NEON_PURPLE,
    borderRadius: 2,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  errorGlyph: { color: NEON_PURPLE, fontSize: 14, fontWeight: "700" },
  error: { color: TEXT, fontSize: 13, fontWeight: "400" },
  emptyState: {
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  emptyGlyph: {
    color: NEON_PURPLE,
    fontSize: 40,
    marginBottom: 18,
  },
  emptyText: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 6,
  },
  emptyHint: {
    color: TEXT_MUTED,
    fontSize: 12,
    textAlign: "center",
  },
  card: {
    backgroundColor: SURFACE,
    borderRadius: 4,
    width: "100%",
    marginBottom: 12,
    padding: 18,
    borderLeftWidth: 2,
    borderLeftColor: NEON_PURPLE,
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
    color: NEON_PURPLE,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  cardLabel: {
    color: NEON_PURPLE,
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: "500",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: TEXT_MUTED,
  },
  cardCount: {
    color: TEXT_MUTED,
    fontSize: 11,
    letterSpacing: 1,
  },
  cardName: {
    fontSize: 22,
    fontWeight: "300",
    color: TEXT,
    letterSpacing: -0.5,
  },
  cardDescription: {
    color: TEXT_DIM,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 19,
    fontWeight: "300",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  cardOpen: {
    color: NEON_PURPLE,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 1.5,
  },
  cardDelete: {
    color: "#FF2E93",
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 1.5,
  },
});
