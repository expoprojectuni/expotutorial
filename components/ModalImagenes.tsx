import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const BG = "#0A0E1A";
const SURFACE = "#141A2E";
const SURFACE_ALT = "#1B2238";
const BORDER = "#2A3458";
const TEXT = "#E8EAF6";
const TEXT_DIM = "#8A93B8";
const TEXT_MUTED = "#5A6285";
const NEON_PURPLE = "#B14EFF";

interface ModalImagenesProps {
  visible: boolean;
  imagenes: string[];
  onClose: () => void;
}

export default function ModalImagenes({ visible, imagenes, onClose }: ModalImagenesProps) {
  const total = imagenes.length;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View
          style={styles.modalContainer}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>{"// galería"}</Text>
              <Text style={styles.title}>imágenes <Text style={styles.titleCount}>({total})</Text></Text>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {total === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyGlyph}>◇</Text>
                <Text style={styles.emptyText}>sin imágenes disponibles</Text>
              </View>
            ) : (
              <View style={styles.grid}>
                {imagenes.map((url, i) => (
                  <View key={i} style={styles.imageSlot}>
                    <Image
                      source={{ uri: url }}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    <Text style={styles.imageLabel}>
                      <Text style={styles.imageLabelDim}>img / </Text>
                      {String(i + 1).padStart(2, "0")}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(5,7,15,0.92)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 520,
    maxHeight: "88%",
    backgroundColor: BG,
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: SURFACE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  eyebrow: {
    color: NEON_PURPLE,
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: "500",
    marginBottom: 4,
  },
  title: {
    color: TEXT,
    fontSize: 20,
    fontWeight: "300",
    letterSpacing: -0.5,
  },
  titleCount: {
    color: NEON_PURPLE,
    fontWeight: "500",
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  closeButtonText: {
    color: TEXT_DIM,
    fontSize: 14,
    fontWeight: "400",
  },
  scrollView: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 28,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyGlyph: {
    color: NEON_PURPLE,
    fontSize: 36,
    marginBottom: 14,
  },
  emptyText: {
    color: TEXT_DIM,
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  imageSlot: {
    width: "48%",
    alignItems: "center",
    backgroundColor: SURFACE_ALT,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 10,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 2,
  },
  imageLabel: {
    color: TEXT,
    fontSize: 11,
    marginTop: 8,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 1.5,
  },
  imageLabelDim: {
    color: TEXT_MUTED,
    fontWeight: "400",
  },
});
