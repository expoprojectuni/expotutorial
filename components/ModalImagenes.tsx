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
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Imagenes ({total})
          </Text>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Cerrar</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {total === 0 ? (
            <Text style={styles.error}>No hay imagenes disponibles</Text>
          ) : (
            <View style={styles.grid}>
              {imagenes.map((url, i) => (
                <View key={i} style={styles.slot}>
                  <Image
                    source={{ uri: url }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                  <Text style={styles.label}>Imagen {i + 1}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#b00",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeBtn: {
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  scroll: {
    padding: 12,
  },
  error: {
    color: "#f66",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  slot: {
    alignItems: "center",
    width: 140,
  },
  image: {
    width: 100,
    height: 100,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: "#ddd",
    fontWeight: "600",
    textAlign: "center",
  },
});
