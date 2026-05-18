import { useAuth } from "@/context/AuthContext";
import { colors, sharedStyles } from "@/theme";
import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreated?: (id: number | string, slug: string, label: string) => void;
}

export default function CrearAnimeModal({
  visible,
  onClose,
  onCreated,
}: Props) {
  const { fetchWithAuth } = useAuth();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);

  const crear = async () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }
    setEnviando(true);
    try {
      const res = await fetchWithAuth("/animes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          ...(descripcion.trim() && { descripcion: descripcion.trim() }),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear anime");
      const slug = nombre.trim().toLowerCase().replace(/\s+/g, "-");
      const animeId = data.id || data.anime?.id || slug;
      Alert.alert("Éxito", `Anime "${nombre}" creado correctamente`);
      onCreated?.(animeId, slug, nombre.trim());
      setNombre("");
      setDescripcion("");
      onClose();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={sharedStyles.backdrop}>
        <View
          style={sharedStyles.backdropClick}
          onStartShouldSetResponder={() => true}
          onResponderRelease={onClose}
        />
        <View
          style={sharedStyles.modalContainer}
          onStartShouldSetResponder={() => true}
        >
          <View
            style={[
              sharedStyles.modalHeader,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={sharedStyles.modalTitle}>Crear Anime</Text>
            <Pressable style={sharedStyles.closeButton} onPress={onClose}>
              <Text
                style={[
                  sharedStyles.closeButtonText,
                  { color: colors.primary },
                ]}
              >
                ✕
              </Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={sharedStyles.modalBody}>
            <Text style={sharedStyles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej: Naruto"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={sharedStyles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Descripción del anime..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
            />

            <Pressable
              style={[sharedStyles.button, { backgroundColor: colors.primary }]}
              onPress={crear}
              disabled={enviando}
            >
              <Text style={sharedStyles.buttonText}>
                {enviando ? "Creando..." : "Crear Anime"}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  previews: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  preview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.bgDark,
  },
});
