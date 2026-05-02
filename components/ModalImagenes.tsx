import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ImagenInfo {
  uri: string | null;
  label: string;
  encontrado: boolean;
}

interface ModalImagenesProps {
  visible: boolean;
  imagenes: ImagenInfo[];
  source: "local" | "internet" | null;
  imagenesError: string[];
  onClose: () => void;
}

export default function ModalImagenes({
  visible,
  imagenes,
  source,
  imagenesError,
  onClose,
}: ModalImagenesProps) {
  const encontradas = imagenes.filter((i) => i.encontrado);
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
            Imágenes ({encontradas.length}/{total})
          </Text>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Cerrar</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {imagenesError.length > 0 &&
            imagenesError.map((err, i) => (
              <Text key={i} style={styles.error}>{err}</Text>
            ))}

          <View style={styles.grid}>
            {imagenes.map((img, i) => (
              <View key={i} style={styles.slot}>
                {img.encontrado ? (
                  <>
                    <Image
                      source={{ uri: img.uri! }}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    <Text style={styles.label}>{img.label}</Text>
                  </>
                ) : (
                  <>
                    <View style={styles.placeholder}>
                      <Text style={styles.placeholderText}>No disponible</Text>
                    </View>
                    <Text style={styles.label}>{img.label}</Text>
                  </>
                )}
              </View>
            ))}
          </View>
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
  placeholder: {
    width: 100,
    height: 100,
    backgroundColor: "#333",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 11,
    color: "#888",
    textAlign: "center",
  },
});
