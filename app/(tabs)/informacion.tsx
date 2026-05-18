import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAnime } from "@/context/AnimeContext";
import { useAuth } from "@/context/AuthContext";
import ModalImagenes from "@/components/ModalImagenes";
import CrearAnimeModal from "@/components/CrearAnimeModal";
import { colors, sharedStyles } from "@/theme";

interface AnimeEntry {
  id: number | string;
  slug: string;
  label: string;
}

export default function InformacionScreen() {
  const { personajes } = useAnime();
  const { fetchWithAuth } = useAuth();
  const [animes, setAnimes] = useState<AnimeEntry[]>([]);
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [mostrarConsulta, setMostrarConsulta] = useState(false);
  const [mostrarCrearAnime, setMostrarCrearAnime] = useState(false);
  const [mostrarModalImg, setMostrarModalImg] = useState(false);

  useEffect(() => {
    cargarAnimes();
  }, []);

  const cargarAnimes = async () => {
    try {
      const res = await fetchWithAuth("/animes");
      if (!res.ok) {
        setAnimes([]);
        return;
      }
      const data = await res.json();
      const lista: AnimeEntry[] = (Array.isArray(data) ? data : []).map((a: any, i: number) => ({
        id: a.id,
        slug: a.nombre?.toLowerCase().replace(/\s+/g, "-") || a.slug || `anime-${i}`,
        label: a.nombre || a.label || `Anime ${i + 1}`,
      }));
      setAnimes(lista);
    } catch {
      setAnimes([]);
    }
  };

  const todosPersonajes = animes
    .map((a) => personajes[a.slug])
    .filter(Boolean) as any[];
  const todasImagenes = todosPersonajes.flatMap((p: any) => (p ? p.imagenes : []));

  const handleAnimeCreado = (id: number | string, slug: string, label: string) => {
    if (!animes.find((a) => a.slug === slug)) {
      setAnimes((prev) => [...prev, { id, slug, label }]);
    }
  };

  const navegarA = (anime: AnimeEntry) => {
    setMostrarConsulta(false);
    router.push(`/animes/${anime.slug}?id=${anime.id}`);
  };

  return (
    <ScrollView contentContainerStyle={sharedStyles.scrollContent}>
      <View style={[sharedStyles.header, styles.header]}>
        <View style={styles.accentBar} />
        <Text style={sharedStyles.headerTitle}>INFORMACIÓN</Text>
        <Text style={[sharedStyles.headerSubtitle, { color: colors.textLight }]}>Administra tu contenido</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.cardsRow}>
          <Pressable style={styles.glassCard} onPress={() => setMostrarResumen(!mostrarResumen)}>
            <Text style={styles.glassTitle}>Resumen</Text>
            <Text style={styles.glassDesc}>Visualiza el resumen de los personajes que has consultado.</Text>
            <Text style={styles.glassBtn}>Entrar</Text>
          </Pressable>

          <Pressable style={styles.glassCard} onPress={() => setMostrarConsulta(true)}>
            <Text style={styles.glassTitle}>Consulta</Text>
            <Text style={styles.glassDesc}>Busca y consulta personajes de tus animes favoritos.</Text>
            <Text style={styles.glassBtn}>Entrar</Text>
          </Pressable>

          <Pressable style={styles.glassCard} onPress={() => setMostrarCrearAnime(true)}>
            <Text style={styles.glassTitle}>Crear Anime</Text>
            <Text style={styles.glassDesc}>Añade nuevos animes y personajes al catálogo.</Text>
            <Text style={styles.glassBtn}>Crear</Text>
          </Pressable>
        </View>

        {mostrarResumen && (
          <View style={styles.resumenSection}>
            {todosPersonajes.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No se han consultado personajes aún</Text>
                <Text style={styles.emptyHint}>Usa "Consulta" para buscar personajes</Text>
              </View>
            ) : (
              <>
                {animes.map((anime) => {
                  const p = personajes[anime.slug];
                  if (!p) return null;
                  return (
                    <View key={anime.slug} style={[sharedStyles.card, { borderLeftWidth: 4, borderLeftColor: colors.primary }]}>
                      <View style={[sharedStyles.cardHeader, { backgroundColor: colors.bg }]}>
                        <Text style={[sharedStyles.cardTitle, { color: colors.primary, fontSize: 14, textTransform: "uppercase", letterSpacing: 1 }]}>{anime.label}</Text>
                      </View>
                      <View style={sharedStyles.cardBody}>
                        <Text style={styles.cardName}>{p.nombre.toUpperCase()}</Text>
                        <View style={sharedStyles.infoRow}>
                          <Text style={[sharedStyles.infoLabel, { color: colors.primary }]}>Descripcion</Text>
                          <Text style={sharedStyles.infoValue}>{p.descripcion}</Text>
                        </View>
                        <View style={sharedStyles.infoRow}>
                          <Text style={[sharedStyles.infoLabel, { color: colors.primary }]}>Habilidades</Text>
                          <Text style={sharedStyles.infoValue}>{p.habilidades}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
                {todasImagenes.length > 0 && (
                  <Pressable style={[sharedStyles.imagesButton, { backgroundColor: colors.primary }]} onPress={() => setMostrarModalImg(true)}>
                    <Text style={sharedStyles.imagesButtonText}>Ver todas las imagenes ({todasImagenes.length})</Text>
                  </Pressable>
                )}
              </>
            )}
          </View>
        )}

        <CrearAnimeModal
          visible={mostrarCrearAnime}
          onClose={() => setMostrarCrearAnime(false)}
          onCreated={handleAnimeCreado}
        />

        <ModalImagenes
          visible={mostrarModalImg}
          imagenes={todasImagenes}
          onClose={() => setMostrarModalImg(false)}
        />

        <Modal
          visible={mostrarConsulta}
          transparent
          animationType="fade"
          onRequestClose={() => setMostrarConsulta(false)}
        >
          <View style={sharedStyles.backdrop}>
            <View style={sharedStyles.backdropClick} onStartShouldSetResponder={() => true} onResponderRelease={() => setMostrarConsulta(false)} />
            <View style={sharedStyles.modalContainer} onStartShouldSetResponder={() => true}>
              <View style={[sharedStyles.modalHeader, { backgroundColor: colors.primary }]}>
                <Text style={sharedStyles.modalTitle}>Seleccionar Anime</Text>
                <Pressable style={sharedStyles.closeButton} onPress={() => setMostrarConsulta(false)}>
                  <Text style={[sharedStyles.closeButtonText, { color: colors.primary }]}>✕</Text>
                </Pressable>
              </View>

              <View style={styles.modalBody}>
                {animes.length === 0 && (
                  <Text style={styles.emptyText}>Cargando animes...</Text>
                )}
                {animes.map((anime) => (
                  <Pressable
                    key={anime.slug}
                    style={[styles.animeOption, { borderLeftColor: colors.primary }]}
                    onPress={() => navegarA(anime)}
                  >
                    <Text style={[styles.animeOptionText, { color: colors.primary }]}>
                      {anime.label}
                    </Text>
                    <Text style={styles.animeOptionArrow}>→</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.bg,
  },
  accentBar: {
    width: 50,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  cardsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
    justifyContent: "center",
  },
  glassCard: {
    width: 220,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 26,
  },
  glassTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  glassDesc: {
    color: colors.textLight,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 18,
  },
  glassBtn: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: colors.primary,
    color: colors.text,
    borderRadius: 12,
    fontWeight: "600",
    fontSize: 14,
    overflow: "hidden",
  },
  resumenSection: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyHint: {
    color: colors.textLight,
    fontSize: 14,
    textAlign: "center",
  },
  cardName: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    textTransform: "uppercase",
    color: colors.text,
  },
  modalBody: {
    padding: 16,
    gap: 12,
  },
  animeOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  animeOptionText: {
    fontSize: 18,
    fontWeight: "700",
  },
  animeOptionArrow: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "600",
  },
});
