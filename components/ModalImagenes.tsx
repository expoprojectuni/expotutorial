import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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
            <Text style={styles.title}>Imágenes ({total})</Text>
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
                <Text style={styles.emptyText}>No hay imágenes disponibles</Text>
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
                    <Text style={styles.imageLabel}>Imagen {i + 1}</Text>
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
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 500,
    maxHeight: "85%",
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#b00",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#b00",
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    color: "#f66",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  imageSlot: {
    width: "48%",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  imageLabel: {
    color: "#ccc",
    fontSize: 12,
    marginTop: 8,
    fontWeight: "600",
    textAlign: "center",
  },
});
