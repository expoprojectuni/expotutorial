import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { colors, sharedStyles } from "@/theme";

export default function RegisterScreen() {
  const { register, loading } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      setError("Completa todos los campos");
      return;
    }
    setError("");
    try {
      await register(email.trim(), password, nombre.trim());
      router.replace("/(tabs)/inicio");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.accentBar} />
        <Text style={styles.title}>STICKERSMASH</Text>
        <Text style={styles.subtitle}>Crear Cuenta</Text>
      </View>

      <View style={styles.form}>
        <Text style={sharedStyles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Tu nombre"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={sharedStyles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="tu@email.com"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={sharedStyles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="********"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
        />

        {error !== "" && (
          <View style={sharedStyles.errorBox}>
            <Text style={sharedStyles.errorText}>{error}</Text>
          </View>
        )}

        <Pressable style={[sharedStyles.button, { backgroundColor: colors.primary }]} onPress={handleRegister} disabled={loading}>
          <Text style={sharedStyles.buttonText}>{loading ? "Registrando..." : "Registrarse"}</Text>
        </Pressable>

        <Link href="/auth/login" style={styles.link}>
          <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia Sesión</Text>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  accentBar: {
    width: 50,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 2,
  },
  subtitle: {
    color: colors.textLight,
    fontSize: 18,
    marginTop: 8,
    fontWeight: "600",
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border + "40",
  },
  link: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});
