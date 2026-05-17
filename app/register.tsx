import { useAuth } from "@/context/AuthContext";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
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
const BORDER = "#2A3458";
const TEXT = "#E8EAF6";
const TEXT_DIM = "#8A93B8";
const TEXT_MUTED = "#5A6285";
const NEON_PURPLE = "#B14EFF";
const ACCENT_SOFT = "#FF2E9322";
const ERROR = "#FF2E93";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const intentarRegistro = () => {
    if (!username.trim() || !password) {
      setError("ingresa usuario y contraseña");
      return;
    }
    if (password !== confirm) {
      setError("las contraseñas no coinciden");
      return;
    }
    const result = register(username, password, displayName);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError("");
    setPassword("");
    setConfirm("");
    router.replace("/(tabs)/saint-seiya");
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{"// new user"}</Text>
          <Text style={styles.headerTitle}>crear cuenta</Text>
          <View style={styles.accentLine} />
          <Text style={styles.headerSubtitle}>regístrate para guardar tus categorías</Text>
        </View>

        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>usuario</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="mínimo 3 caracteres"
              placeholderTextColor={TEXT_MUTED}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>nombre visible (opcional)</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="cómo quieres que te llamen"
              placeholderTextColor={TEXT_MUTED}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="mínimo 4 caracteres"
              placeholderTextColor={TEXT_MUTED}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>confirmar contraseña</Text>
            <TextInput
              style={styles.input}
              value={confirm}
              onChangeText={setConfirm}
              placeholder="repite la contraseña"
              placeholderTextColor={TEXT_MUTED}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Pressable style={styles.button} onPress={intentarRegistro}>
            <Text style={styles.buttonText}>▸ crear cuenta</Text>
          </Pressable>

          {error !== "" && (
            <View style={styles.errorBox}>
              <Text style={styles.errorGlyph}>!</Text>
              <Text style={styles.error}>{error}</Text>
            </View>
          )}

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿ya tienes cuenta?</Text>
            <Link href="/login" replace style={styles.footerLink}>
              iniciar sesión
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: BG },
  scroll: { backgroundColor: BG },
  scrollContent: { flexGrow: 1, backgroundColor: BG },
  header: {
    paddingTop: 90,
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
    paddingTop: 32,
    paddingBottom: 60,
    backgroundColor: BG,
  },
  inputContainer: { width: "100%", marginBottom: 18 },
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
    borderColor: NEON_PURPLE,
    paddingHorizontal: 24,
    paddingVertical: 14,
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
  errorBox: {
    backgroundColor: ACCENT_SOFT,
    borderLeftWidth: 2,
    borderLeftColor: ERROR,
    borderRadius: 2,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  errorGlyph: { color: ERROR, fontSize: 14, fontWeight: "700" },
  error: { color: TEXT, fontSize: 13, fontWeight: "400" },
  footerRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    color: TEXT_DIM,
    fontSize: 13,
  },
  footerLink: {
    color: NEON_PURPLE,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
  },
});
