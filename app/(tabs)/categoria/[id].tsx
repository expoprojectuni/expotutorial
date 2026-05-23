import { useCategories } from "@/context/CategoriesContext";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
const ACCENT_SOFT = "#B14EFF22";
const DANGER = "#FF2E93";

const MAX_IMAGENES = 8;
const IMAGEN_WIDTH = 600;
const IMAGEN_COMPRESS = 0.4;

export default function CategoriaDetalleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    obtenerCategoria,
    agregarAnime,
    eliminarAnime,
    loading,
    error: errorGlobal,
    refrescar,
  } = useCategories();

  const categoria = obtenerCategoria(id ?? "");

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [genero, setGenero] = useState("");
  const [episodios, setEpisodios] = useState("");
  const [estudio, setEstudio] = useState("");
  const [estado, setEstado] = useState("");
  const [notas, setNotas] = useState("");
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [cargandoImagen, setCargandoImagen] = useState(false);

  if (!categoria) {
    if (loading) {
      return (
        <View style={styles.notFound}>
          <Text style={styles.notFoundGlyph}>◇</Text>
          <Text style={styles.notFoundText}>cargando categoría...</Text>
        </View>
      );
    }
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundGlyph}>◇</Text>
        <Text style={styles.notFoundText}>
          {errorGlobal ?? "categoría no encontrada"}
        </Text>
        {errorGlobal && (
          <Pressable style={[styles.backButton, { marginBottom: 10 }]} onPress={() => refrescar()}>
            <Text style={styles.backButtonText}>▸ reintentar</Text>
          </Pressable>
        )}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>▸ volver</Text>
        </Pressable>
      </View>
    );
  }

  const seleccionarImagen = async () => {
    if (cargandoImagen) return;
    if (imagenes.length >= MAX_IMAGENES) {
      setError(`solo puedes adjuntar hasta ${MAX_IMAGENES} imágenes por anime`);
      return;
    }
    setCargandoImagen(true);
    try {
      const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permiso.granted) {
        setError("necesitamos permiso para acceder a tus fotos");
        return;
      }
      const restantes = MAX_IMAGENES - imagenes.length;
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: restantes,
        quality: 1,
      });
      if (resultado.canceled) return;
      const dataUris: string[] = [];
      for (const asset of resultado.assets.slice(0, restantes)) {
        const context = ImageManipulator.ImageManipulator.manipulate(asset.uri);
        context.resize({ width: IMAGEN_WIDTH });
        const image = await context.renderAsync();
        const guardado = await image.saveAsync({
          format: ImageManipulator.SaveFormat.JPEG,
          compress: IMAGEN_COMPRESS,
          base64: true,
        });
        if (guardado.base64) {
          dataUris.push(`data:image/jpeg;base64,${guardado.base64}`);
        }
      }
      if (dataUris.length === 0) {
        setError("no se pudo procesar la imagen seleccionada");
        return;
      }
      setImagenes((prev) => [...prev, ...dataUris].slice(0, MAX_IMAGENES));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "no se pudo cargar la imagen");
    } finally {
      setCargandoImagen(false);
    }
  };

  const quitarImagen = (index: number) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  const limpiarFormulario = () => {
    setTitulo("");
    setDescripcion("");
    setGenero("");
    setEpisodios("");
    setEstudio("");
    setEstado("");
    setNotas("");
    setImagenes([]);
    setError("");
  };

  const guardarAnime = async () => {
    if (!titulo.trim()) {
      setError("el título es obligatorio");
      return;
    }
    const duplicado = categoria.animes.some(
      (a) => a.titulo.toLowerCase() === titulo.trim().toLowerCase()
    );
    if (duplicado) {
      setError("ya existe un anime con ese título en esta categoría");
      return;
    }
    setEnviando(true);
    setError("");
    try {
      await agregarAnime(categoria.id, {
        titulo,
        descripcion,
        genero,
        episodios,
        estudio,
        estado,
        notas,
        imagenes,
      });
      limpiarFormulario();
    } catch (e) {
      setError(e instanceof Error ? e.message : "error al guardar anime");
    } finally {
      setEnviando(false);
    }
  };

  const confirmarEliminarAnime = (animeId: string, nombreAnime: string) => {
    Alert.alert("eliminar anime", `¿borrar "${nombreAnime}"?`, [
      { text: "cancelar", style: "cancel" },
      {
        text: "eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await eliminarAnime(categoria.id, animeId);
          } catch (e) {
            Alert.alert(
              "no se pudo eliminar",
              e instanceof Error ? e.message : "error desconocido"
            );
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable style={styles.headerBack} onPress={() => router.back()} hitSlop={10}>
            <Text style={styles.headerBackText}>‹ volver</Text>
          </Pressable>
          <Text style={styles.eyebrow}>{"// categoría"}</Text>
          <Text style={styles.headerTitle}>{categoria.nombre.toLowerCase()}</Text>
          <View style={styles.accentLine} />
          {categoria.descripcion !== "" && (
            <Text style={styles.headerSubtitle}>{categoria.descripcion}</Text>
          )}
          <Text style={styles.headerCount}>
            {categoria.animes.length} anime{categoria.animes.length === 1 ? "" : "s"} registrado{categoria.animes.length === 1 ? "" : "s"}
          </Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.sectionTitle}>{"› agregar anime"}</Text>

          <CampoInput label="título *" value={titulo} onChangeText={setTitulo} placeholder="ej: cowboy bebop" />
          <CampoInput label="descripción" value={descripcion} onChangeText={setDescripcion} placeholder="sinopsis breve" multiline />
          <CampoInput label="género" value={genero} onChangeText={setGenero} placeholder="ej: acción, sci-fi" />
          <CampoInput label="episodios" value={episodios} onChangeText={setEpisodios} placeholder="ej: 26" keyboardType="numeric" />
          <CampoInput label="estudio" value={estudio} onChangeText={setEstudio} placeholder="ej: sunrise" />
          <CampoInput label="estado" value={estado} onChangeText={setEstado} placeholder="ej: finalizado, en emisión..." />
          <CampoInput label="notas personales" value={notas} onChangeText={setNotas} placeholder="qué te pareció" multiline />

          <Text style={styles.label}>imágenes ({imagenes.length}/{MAX_IMAGENES})</Text>
          <Pressable
            style={[
              styles.pickImagenButton,
              (cargandoImagen || imagenes.length >= MAX_IMAGENES) && styles.buttonDisabled,
            ]}
            onPress={seleccionarImagen}
            disabled={cargandoImagen || imagenes.length >= MAX_IMAGENES}
          >
            <Text style={styles.pickImagenButtonText}>
              {cargandoImagen
                ? "▸ abriendo galería..."
                : imagenes.length >= MAX_IMAGENES
                  ? "▸ máximo alcanzado"
                  : "▸ elegir desde galería"}
            </Text>
            <Text style={styles.pickImagenHint}>
              hasta {MAX_IMAGENES} imágenes · se comprimen automáticamente
            </Text>
          </Pressable>

          {imagenes.length > 0 && (
            <View style={styles.imagenesPreview}>
              {imagenes.map((url, i) => (
                <View key={`${url}-${i}`} style={styles.imagenSlot}>
                  <Image source={{ uri: url }} style={styles.imagenPreview} resizeMode="cover" />
                  <View style={styles.imagenInfo}>
                    <Text style={styles.imagenIndice}>#{String(i + 1).padStart(2, "0")}</Text>
                    <Pressable hitSlop={8} onPress={() => quitarImagen(i)}>
                      <Text style={styles.imagenQuitar}>quitar</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}

          <Pressable
            style={[styles.button, enviando && styles.buttonDisabled]}
            onPress={guardarAnime}
            disabled={enviando}
          >
            <Text style={styles.buttonText}>
              {enviando ? "▸ guardando..." : "▸ guardar anime"}
            </Text>
          </Pressable>

          {error !== "" && (
            <View style={styles.errorBox}>
              <Text style={styles.errorGlyph}>!</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>{"› animes de la categoría"}</Text>

          {categoria.animes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyGlyph}>◇</Text>
              <Text style={styles.emptyText}>aún no hay animes</Text>
              <Text style={styles.emptyHint}>agrega el primero con el formulario superior</Text>
            </View>
          ) : (
            categoria.animes.map((a, i) => (
              <Pressable
                key={a.id}
                style={styles.animeCard}
                onPress={() => router.push(`/anime/${categoria.id}/${a.id}`)}
              >
                <View style={styles.animeTop}>
                  <Text style={styles.animeTag}>{String(i + 1).padStart(2, "0")}</Text>
                  <Text style={styles.animeLabel}>anime</Text>
                  <View style={styles.animeDot} />
                  <Text style={styles.animeMeta}>
                    {a.imagenes.length} img · {a.episodios || "?"} ep
                  </Text>
                </View>
                <Text style={styles.animeName}>{a.titulo.toLowerCase()}</Text>
                {a.genero !== "" && <Text style={styles.animeGenero}>{a.genero}</Text>}
                <View style={styles.animeFooter}>
                  <Text style={styles.animeOpen}>▸ ver detalle</Text>
                  <Pressable hitSlop={10} onPress={() => confirmarEliminarAnime(a.id, a.titulo)}>
                    <Text style={styles.animeDelete}>eliminar</Text>
                  </Pressable>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function CampoInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric";
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textarea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={TEXT_MUTED}
        multiline={multiline}
        numberOfLines={multiline ? 3 : undefined}
        keyboardType={keyboardType ?? "default"}
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: BG },
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
  headerBack: {
    marginBottom: 14,
    alignSelf: "flex-start",
  },
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
    fontSize: 38,
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
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  headerCount: {
    color: TEXT_MUTED,
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 4,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 80,
    backgroundColor: BG,
  },
  sectionTitle: {
    color: TEXT_DIM,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 12,
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
    paddingVertical: 13,
    fontSize: 14,
    color: TEXT,
  },
  textarea: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  pickImagenButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: NEON_PURPLE,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  pickImagenButtonText: {
    color: NEON_PURPLE,
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 2,
  },
  pickImagenHint: {
    color: TEXT_MUTED,
    fontSize: 11,
    letterSpacing: 0.5,
    marginTop: 6,
    textAlign: "center",
  },
  imagenesPreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  imagenSlot: {
    width: "48%",
    backgroundColor: SURFACE_ALT,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 8,
  },
  imagenPreview: {
    width: "100%",
    height: 110,
    borderRadius: 2,
    backgroundColor: BG,
  },
  imagenInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  imagenIndice: {
    color: TEXT_DIM,
    fontSize: 10,
    letterSpacing: 1,
  },
  imagenQuitar: {
    color: DANGER,
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "transparent",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: NEON_PURPLE,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 8,
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
  errorText: { color: TEXT, fontSize: 13 },
  emptyState: {
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 20,
  },
  emptyGlyph: { color: NEON_PURPLE, fontSize: 40, marginBottom: 14 },
  emptyText: { color: TEXT, fontSize: 14, marginBottom: 6 },
  emptyHint: { color: TEXT_MUTED, fontSize: 12, textAlign: "center" },
  animeCard: {
    backgroundColor: SURFACE,
    borderRadius: 4,
    width: "100%",
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 2,
    borderLeftColor: NEON_PURPLE,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: BORDER,
    borderRightColor: BORDER,
    borderBottomColor: BORDER,
  },
  animeTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  animeTag: {
    color: NEON_PURPLE,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  animeLabel: {
    color: NEON_PURPLE,
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: "500",
  },
  animeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: TEXT_MUTED,
  },
  animeMeta: {
    color: TEXT_MUTED,
    fontSize: 11,
    letterSpacing: 1,
  },
  animeName: {
    fontSize: 20,
    fontWeight: "300",
    color: TEXT,
    letterSpacing: -0.5,
  },
  animeGenero: {
    color: TEXT_DIM,
    fontSize: 12,
    marginTop: 4,
    fontWeight: "300",
  },
  animeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  animeOpen: {
    color: NEON_PURPLE,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 1.5,
  },
  animeDelete: {
    color: DANGER,
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 1.5,
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
