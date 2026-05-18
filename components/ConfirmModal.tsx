import { colors, sharedStyles } from "@/theme";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  visible: boolean;
  titulo: string;
  mensaje: string;
  confirmarLabel?: string;
  cancelarLabel?: string;
  peligro?: boolean;
  enviando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ConfirmModal({
  visible,
  titulo,
  mensaje,
  confirmarLabel = "Confirmar",
  cancelarLabel = "Cancelar",
  peligro = false,
  enviando = false,
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancelar}>
      <View style={sharedStyles.backdrop}>
        <View style={sharedStyles.backdropClick} onStartShouldSetResponder={() => true} onResponderRelease={onCancelar} />
        <View style={sharedStyles.modalContainer} onStartShouldSetResponder={() => true}>
          <View style={[sharedStyles.modalHeader, { backgroundColor: peligro ? colors.danger : colors.primary }]}>
            <Text style={sharedStyles.modalTitle}>{titulo}</Text>
            <Pressable style={sharedStyles.closeButton} onPress={onCancelar}>
              <Text style={[sharedStyles.closeButtonText, { color: colors.primary }]}>✕</Text>
            </Pressable>
          </View>

          <View style={sharedStyles.modalBody}>
            <Text style={styles.mensaje}>{mensaje}</Text>

            <Pressable
              style={[sharedStyles.button, { backgroundColor: peligro ? colors.danger : colors.primary, marginBottom: 10 }]}
              onPress={onConfirmar}
              disabled={enviando}
            >
              {enviando ? (
                <ActivityIndicator color={colors.text} size="small" />
              ) : (
                <Text style={sharedStyles.buttonText}>{confirmarLabel}</Text>
              )}
            </Pressable>

            <Pressable
              style={[sharedStyles.button, { backgroundColor: colors.secondary, marginBottom: 0 }]}
              onPress={onCancelar}
              disabled={enviando}
            >
              <Text style={sharedStyles.buttonText}>{cancelarLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mensaje: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
  },
});
