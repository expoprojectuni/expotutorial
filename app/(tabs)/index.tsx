import Button from "@/components/Button";
import ImageViewer from "@/components/ImageViewer";
import { StyleSheet, View } from "react-native";
const PlaceholderImage = require("@/assets/images/images/background-image.png");

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Choose a photo" />
        <Button label="Use this photo" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#347ad0ff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#ffffff19",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#cfbabaff",
    paddingTop: 20,
    backgroundColor: "blue",
    alignItems: "center",
  },

  imageContainer: {
    flex: 1,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
    paddingTop: 100,
  },

  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
});
