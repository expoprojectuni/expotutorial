import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

const FEATURES = [
  { icon: "search", text: "Buscar animes y personajes" },
  { icon: "create", text: "Crear y editar información de animes" },
  { icon: "people", text: "Agregar personajes con imágenes" },
  { icon: "folder-open", text: "Organizar tu colección personal" },
  { icon: "compass", text: "Descubrir nuevos animes y personajes" },
] as const;

export default function InicioScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.hero}>
        <View style={styles.accentBar} />
        <Text style={styles.logo}>AniVault</Text>
        <Text style={styles.tagline}>
          Descubre, organiza y explora tus animes favoritos en un solo lugar.
        </Text>
      </View>

      <View style={styles.container}>
        <View style={styles.aboutCard}>
          <Ionicons name="information-circle" size={28} color={colors.primary} />
          <Text style={styles.aboutText}>
            AniVault es una aplicación diseñada para los amantes del anime. Puedes
            buscar, crear y editar animes fácilmente, además de agregar y
            administrar personajes con imágenes personalizadas.
          </Text>
        </View>

        <View style={styles.aboutCard}>
          <Ionicons name="rocket" size={28} color={colors.primary} />
          <Text style={styles.aboutText}>
            Crea tu propio catálogo de animes, guarda información de tus
            personajes favoritos y descubre nuevas series para ver. Todo en una
            plataforma simple, rápida y visual.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Características</Text>

        <View style={styles.featuresList}>
          {FEATURES.map((f) => (
            <View key={f.text} style={styles.featureCard}>
              <View style={styles.iconCircle}>
                <Ionicons name={f.icon} size={22} color={colors.text} />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerAccent} />
          <Text style={styles.footerText}>
            Tu mundo anime, organizado en un solo lugar.
          </Text>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: colors.bg,
    paddingTop: 100,
    paddingBottom: 50,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  accentBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginBottom: 24,
  },
  logo: {
    color: colors.text,
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: 4,
  },
  tagline: {
    color: colors.textLight,
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 26,
    maxWidth: 320,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 50,
  },
  aboutCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border + "20",
  },
  aboutText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 24,
    marginBottom: 16,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  featuresList: {
    gap: 10,
    marginBottom: 30,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border + "20",
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    paddingTop: 20,
  },
  footerAccent: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginBottom: 16,
  },
  footerText: {
    color: colors.textLight,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 22,
  },
});
