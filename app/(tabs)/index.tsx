import ModalImagenes from "@/components/ModalImagenes";
import { useAnime } from "@/context/AnimeContext";
import { useAuth } from "@/context/AuthContext";
import { useCategories } from "@/context/CategoriesContext";
import { useRouter } from "expo-router";
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
  const { categorias } = useCategories();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mostrarModal, setMostrarModal] = useState(false);

  const saints = personajes["saint-seiya"];
  const hunters = personajes["hunter-x-hunter"];
  const pirates = personajes["one-piece"];

  const cerrarSesion = () => {
    logout();
    router.replace("/login");
  };

  const totalConsultas = saints.length + hunters.length + pirates.length;
  const todasImagenes = [
    ...saints.flatMap((p) => p.imagenes),
    ...hunters.flatMap((p) => p.imagenes),
    ...pirates.flatMap((p) => p.imagenes),
  ];

  const totalAnimes = categorias.reduce((acc, c) => acc + c.animes.length, 0);
  const todasImagenesUsuario = categorias.flatMap((c) =>
    c.animes.flatMap((a) => a.imagenes),
  );
  const galeriaCompleta = [...todasImagenes, ...todasImagenesUsuario];
  const sinContenido = totalConsultas === 0 && categorias.length === 0;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.eyebrow}>{"// dashboard"}</Text>
          {user && (
            <View style={styles.userBadge}>
              <View style={styles.userDot} />
              <Text style={styles.userBadgeText}>{user.displayName}</Text>
            </View>
          )}
        </View>
        <Text style={styles.headerTitle}>resumen</Text>
        <View style={styles.accentLine} />
        <Text style={styles.headerSubtitle}>
          personajes consultados en sesión
        </Text>
      </View>

      <View style={styles.container}>
        {sinContenido ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyGlyph}>◇</Text>
            <Text style={styles.emptyText}>sin contenido todavía</Text>
            <Text style={styles.emptyHint}>
              busca personajes o crea categorías propias
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.statsRow}>
              <StatPill label="consultas" value={String(totalConsultas)} />
              <StatPill label="categorías" value={String(categorias.length)} />
              <StatPill label="animes" value={String(totalAnimes)} />
            </View>

            {totalConsultas > 0 && (
              <>
                <Text style={styles.sectionTitle}>
                  {"› personajes consultados"}
                </Text>
                {saints.map((p) => (
                  <PersonajeCard
                    key={`saint-${p.id}`}
                    data={p}
                    accent={SAINT}
                    label="saint seiya"
                    tag="01"
                  />
                ))}
                {hunters.map((p) => (
                  <PersonajeCard
                    key={`hunter-${p.id}`}
                    data={p}
                    accent={HUNTER}
                    label="hunter x hunter"
                    tag="02"
                  />
                ))}
                {pirates.map((p) => (
                  <PersonajeCard
                    key={`pirate-${p.id}`}
                    data={p}
                    accent={PIRATE}
                    label="one piece"
                    tag="03"
                  />
                ))}
              </>
            )}

            {categorias.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>{"› mis categorías"}</Text>
                {categorias.map((c, i) => (
                  <View key={c.id} style={styles.categoriaCard}>
                    <View style={styles.categoriaTop}>
                      <Text style={styles.categoriaTag}>
                        {String(i + 1).padStart(2, "0")}
                      </Text>
                      <Text style={styles.categoriaLabel}>categoría</Text>
                      <View style={styles.categoriaDot} />
                      <Text style={styles.categoriaCount}>
                        {c.animes.length} animes
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => router.push(`/categoria/${c.id}`)}
                    >
                      <Text style={styles.categoriaName}>
                        {c.nombre.toLowerCase()}
                      </Text>
                    </Pressable>
                    {c.descripcion !== "" && (
                      <Text style={styles.categoriaDescription}>
                        {c.descripcion}
                      </Text>
                    )}

                    {c.animes.length > 0 && (
                      <View style={styles.animesList}>
                        {c.animes.map((a) => (
                          <Pressable
                            key={a.id}
                            style={styles.animeRow}
                            onPress={() =>
                              router.push(`/anime/${c.id}/${a.id}`)
                            }
                          >
                            {a.imagenes[0] ? (
                              <Image
                                source={{ uri: a.imagenes[0] }}
                                style={styles.animeThumb}
                              />
                            ) : (
                              <View
                                style={[
                                  styles.animeThumb,
                                  styles.animeThumbEmpty,
                                ]}
                              >
                                <Text style={styles.animeThumbGlyph}>◆</Text>
                              </View>
                            )}
                            <View style={styles.animeInfo}>
                              <Text style={styles.animeTitle} numberOfLines={1}>
                                {a.titulo.toLowerCase()}
                              </Text>
                              <Text style={styles.animeMeta} numberOfLines={1}>
                                {[
                                  a.genero,
                                  a.episodios && `${a.episodios} ep`,
                                  `${a.imagenes.length} img`,
                                ]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </Text>
                            </View>
                            <Text style={styles.animeArrow}>›</Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </>
            )}

            {galeriaCompleta.length > 0 && (
              <Pressable
                style={styles.imagesButton}
                onPress={() => setMostrarModal(true)}
              >
                <Text style={styles.imagesButtonText}>
                  ▸ ver galería completa
                </Text>
                <Text style={styles.imagesButtonCount}>
                  {galeriaCompleta.length}
                </Text>
              </Pressable>
            )}
          </>
        )}

        <Pressable style={styles.logoutButton} onPress={cerrarSesion}>
          <Text style={styles.logoutButtonText}>▸ cerrar sesión</Text>
        </Pressable>

        <ModalImagenes
          visible={mostrarModal}
          imagenes={galeriaCompleta}
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
  data: {
    nombre: string;
    descripcion: string;
    habilidades: string;
    imagenes: string[];
  };
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
        <Text style={[styles.infoValue, { color: accent }]}>
          {data.imagenes.length} recuperadas
        </Text>
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
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 2,
    backgroundColor: SURFACE,
  },
  userDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: NEON_PURPLE,
  },
  userBadgeText: {
    color: TEXT,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: "500",
  },
  logoutButton: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    alignItems: "center",
  },
  logoutButtonText: {
    color: TEXT_DIM,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 2,
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
  sectionTitle: {
    color: TEXT_DIM,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 8,
    marginBottom: 12,
    letterSpacing: 2,
  },
  categoriaCard: {
    backgroundColor: SURFACE,
    borderRadius: 4,
    width: "100%",
    marginBottom: 14,
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
  categoriaTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  categoriaTag: {
    color: NEON_PURPLE,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  categoriaLabel: {
    color: NEON_PURPLE,
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: "500",
  },
  categoriaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: TEXT_MUTED,
  },
  categoriaCount: {
    color: TEXT_MUTED,
    fontSize: 11,
    letterSpacing: 1,
  },
  categoriaName: {
    fontSize: 22,
    fontWeight: "300",
    color: TEXT,
    letterSpacing: -0.5,
  },
  categoriaDescription: {
    color: TEXT_DIM,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 19,
    fontWeight: "300",
  },
  animesList: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    gap: 8,
  },
  animeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 6,
  },
  animeThumb: {
    width: 44,
    height: 44,
    borderRadius: 2,
    backgroundColor: "#1B2238",
  },
  animeThumbEmpty: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },
  animeThumbGlyph: {
    color: NEON_PURPLE,
    fontSize: 14,
  },
  animeInfo: {
    flex: 1,
  },
  animeTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  animeMeta: {
    color: TEXT_MUTED,
    fontSize: 11,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  animeArrow: {
    color: TEXT_DIM,
    fontSize: 20,
    fontWeight: "300",
  },
});
