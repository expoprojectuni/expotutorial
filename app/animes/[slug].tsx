import ConfirmModal from "@/components/ConfirmModal";
import CrearPersonajeModal from "@/components/CrearPersonajeModal";
import ModalImagenes from "@/components/ModalImagenes";
import { Personaje, useAnime } from "@/context/AnimeContext";
import { useAuth } from "@/context/AuthContext";
import { colors, sharedStyles } from "@/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function AnimeScreen() {
  const { slug, id } = useLocalSearchParams<{ slug: string; id: string }>();

  const [nombre, setNombre] = useState("");
  const { personajes, setPersonaje } = useAnime();
  const { fetchWithAuth } = useAuth();
  const [error, setError] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarCrearPersonaje, setMostrarCrearPersonaje] = useState(false);
  const [mostrarEditarPersonaje, setMostrarEditarPersonaje] = useState(false);
  const [personajeAEditar, setPersonajeAEditar] = useState<Personaje | null>(null);
  const [imagenesModal, setImagenesModal] = useState<string[]>([]);
  const [listaPersonajes, setListaPersonajes] = useState<Personaje[]>([]);
  const [cargandoLista, setCargandoLista] = useState(false);
  const [confirmacion, setConfirmacion] = useState<{ tipo: "personaje" | "anime"; personaje?: Personaje } | null>(null);
  const [confirmEnviando, setConfirmEnviando] = useState(false);

  const personaje = personajes[slug];

  const ejecutarConfirmacion = async () => {
    if (!confirmacion) return;
    setConfirmEnviando(true);
    try {
      if (confirmacion.tipo === "personaje") {
        const p = confirmacion.personaje!;
        if (!p.id) {
          Alert.alert("Error", "Este personaje no tiene un ID válido para eliminar.");
          return;
        }
        const res = await fetchWithAuth(`/personajes/${p.id}`, { method: "DELETE" });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          Alert.alert("Error", errData.error || `Error ${res.status}`);
          return;
        }
        Alert.alert("Eliminado", `Personaje "${p.nombre}" eliminado`);
        if (personaje?.id === p.id) setPersonaje(slug, null as any);
        setListaPersonajes((prev) => prev.filter((x) => x.id !== p.id));
      } else {
        const animeId = id || slug;
        const res = await fetchWithAuth(`/animes/${animeId}`, { method: "DELETE" });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          Alert.alert("Error", errData.error || `Error ${res.status}`);
          return;
        }
        Alert.alert("Eliminado", `Anime eliminado`);
        router.back();
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setConfirmEnviando(false);
      setConfirmacion(null);
    }
  };

  const consultarPersonaje = async () => {
    if (!nombre.trim()) return;
    setError("");
    setMostrarModal(false);
    try {
      const res = await fetchWithAuth(`/${slug}/${nombre.toLowerCase().trim()}`);
      if (!res.ok) throw new Error("Personaje no encontrado");
      const data: Personaje = await res.json();
      setPersonaje(slug, data);
      setImagenesModal(data.imagenes);
      Alert.alert(
        data.nombre.toUpperCase(),
        `Descripcion: ${data.descripcion}\nHabilidades: ${data.habilidades}\nImagenes recuperadas: ${data.imagenes.length}`,
        [
          { text: "OK" },
          ...(data.imagenes.length > 0
            ? [{ text: "Ver imagenes", onPress: () => setMostrarModal(true) }]
            : []),
        ]
      );
    } catch (e: any) {
      setError(e.message);
    }
  };

  const listarPersonajes = async () => {
    setError("");
    setCargandoLista(true);
    try {
      const res = await fetchWithAuth(`/${slug}`);
      if (!res.ok) throw new Error("Error al obtener personajes");
      const data: Personaje[] = await res.json();
      setListaPersonajes(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCargandoLista(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={sharedStyles.scrollContent} keyboardShouldPersistTaps="handled">
      <View style={[sharedStyles.header, { backgroundColor: colors.bg }]}>
        <View style={[styles.accentBar, { backgroundColor: colors.primary }]} />
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </Pressable>
        <Text style={sharedStyles.headerTitle}>{slug.toUpperCase()}</Text>
        <Text style={[sharedStyles.headerSubtitle, { color: colors.secondary }]}>Gestiona personajes e imagenes</Text>
      </View>

      <View style={[sharedStyles.container, { backgroundColor: colors.bg, alignItems: "center" }]}>
        <View style={[styles.inputContainer]}>
          <Text style={[sharedStyles.label, { color: colors.secondary }]}>Nombre del personaje</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej: seiya, gon, luffy..."
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <Pressable style={[sharedStyles.button, { backgroundColor: colors.primary, width: "100%", marginBottom: 12 }]} onPress={consultarPersonaje}>
          <Text style={sharedStyles.buttonText}>Consultar</Text>
        </Pressable>

        <Pressable style={[sharedStyles.button, { backgroundColor: colors.primary, width: "100%", marginBottom: 12 }]} onPress={() => setMostrarCrearPersonaje(true)}>
          <Text style={sharedStyles.buttonText}>Crear Personaje</Text>
        </Pressable>

        <Pressable style={[sharedStyles.button, { backgroundColor: colors.primary, width: "100%", marginBottom: 12 }]} onPress={listarPersonajes}>
          <Text style={sharedStyles.buttonText}>Listar Personajes</Text>
        </Pressable>

        <Pressable style={[sharedStyles.button, { backgroundColor: colors.danger, width: "100%", marginBottom: 16 }]} onPress={() => setConfirmacion({ tipo: "anime" })}>
          <Text style={sharedStyles.buttonText}>Eliminar Anime</Text>
        </Pressable>

        {cargandoLista && <ActivityIndicator size="large" color={colors.primary} style={{ marginBottom: 16 }} />}

        {error !== "" && (
          <View style={[sharedStyles.errorBox, { backgroundColor: colors.surface, borderColor: colors.danger }]}>
            <Text style={[sharedStyles.errorText, { color: colors.danger }]}>{error}</Text>
          </View>
        )}

        {personaje && (
          <View style={sharedStyles.card}>
            <View style={[sharedStyles.cardHeader, { backgroundColor: colors.primary }]}>
              <Text style={sharedStyles.cardTitle}>{personaje.nombre.toUpperCase()}</Text>
            </View>
            <View style={sharedStyles.cardBody}>
              <View style={sharedStyles.infoRow}>
                <Text style={[sharedStyles.infoLabel, { color: colors.primary }]}>Descripcion</Text>
                <Text style={sharedStyles.infoValue}>{personaje.descripcion}</Text>
              </View>
              <View style={sharedStyles.infoRow}>
                <Text style={[sharedStyles.infoLabel, { color: colors.primary }]}>Habilidades</Text>
                <Text style={sharedStyles.infoValue}>{personaje.habilidades}</Text>
              </View>
              <View style={sharedStyles.infoRow}>
                <Text style={[sharedStyles.infoLabel, { color: colors.primary }]}>Imagenes</Text>
                <Text style={sharedStyles.infoValue}>{personaje.imagenes.length} recuperadas</Text>
              </View>
            </View>
            {personaje.imagenes.length > 0 && (
              <Pressable style={[sharedStyles.imagesButton, { backgroundColor: colors.primary, marginBottom: 12 }]} onPress={() => { setImagenesModal(personaje.imagenes); setMostrarModal(true); }}>
                <Text style={sharedStyles.imagesButtonText}>Ver Imagenes ({personaje.imagenes.length})</Text>
              </Pressable>
            )}
            <View style={styles.cardActions}>
              <Pressable style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => { setPersonajeAEditar(personaje); setMostrarEditarPersonaje(true); }}>
                <Text style={styles.actionBtnText}>Actualizar</Text>
              </Pressable>
              <Pressable style={[styles.actionBtn, { backgroundColor: colors.danger }]} onPress={() => setConfirmacion({ tipo: "personaje", personaje })}>
                <Text style={styles.actionBtnText}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        )}

        {listaPersonajes.length > 0 && (
          <View style={styles.listaSection}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Personajes ({listaPersonajes.length})</Text>
            <View style={styles.listContainer}>
              {listaPersonajes.map((p) => (
                <Pressable
                  key={p.id}
                  style={[styles.listItem, { borderColor: colors.primary }]}
                  onPress={() => setNombre(p.nombre.toLowerCase())}
                >
                  <Text style={[styles.listItemText, { color: colors.primary }]}>{p.nombre}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <CrearPersonajeModal
          visible={mostrarCrearPersonaje}
          onClose={() => setMostrarCrearPersonaje(false)}
          animeId={id || slug}
          animeNombre={slug.toUpperCase()}
        />

        <CrearPersonajeModal
          visible={mostrarEditarPersonaje}
          onClose={() => { setMostrarEditarPersonaje(false); setPersonajeAEditar(null); }}
          animeId={id || slug}
          animeNombre={slug.toUpperCase()}
          personaje={personajeAEditar}
        />

        <ModalImagenes
          visible={mostrarModal}
          imagenes={imagenesModal}
          onClose={() => setMostrarModal(false)}
        />

        <ConfirmModal
          visible={confirmacion !== null}
          titulo={confirmacion?.tipo === "personaje" ? "Eliminar Personaje" : "Eliminar Anime"}
          mensaje={
            confirmacion?.tipo === "personaje"
              ? `¿Eliminar "${confirmacion?.personaje?.nombre}" permanentemente?`
              : `¿Eliminar este anime permanentemente? Se eliminarán todos sus personajes e imágenes.`
          }
          confirmarLabel="Eliminar"
          cancelarLabel="Cancelar"
          peligro
          enviando={confirmEnviando}
          onConfirmar={ejecutarConfirmacion}
          onCancelar={() => { setConfirmacion(null); setConfirmEnviando(false); }}
        />

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  accentBar: {
    width: 50,
    height: 4,
    borderRadius: 2,
    marginBottom: 20,
  },
  backButton: { alignSelf: "flex-start", marginBottom: 8 },
  backButtonText: { color: colors.text, fontSize: 16, fontWeight: "600" },
  inputContainer: { width: "100%", marginBottom: 16 },
  input: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border + "40",
  },
  listaSection: {
    width: "100%",
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    alignSelf: "flex-start",
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    justifyContent: "flex-start",
    gap: 8,
  },
  listItem: {
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  listItemText: { fontSize: 12, fontWeight: "600" },
  cardActions: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    paddingTop: 0,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  actionBtnText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
