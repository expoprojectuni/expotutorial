import Button from "@/components/Button";
import ImageViewer from "@/components/ImageViewer";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
const PlaceholderImage = require("@/assets/images/images/background-image.png");

export default function Index() {
  const [selectedImage, setSelectedImage] = useState(null);
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      console.log(result);
    } else {
      alert("You did not select any image.");
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer
          imgSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
      </View>
      <View style={styles.footerContainer}>
        <Button
          theme="primary"
          label="Choose a photo"
          onPress={pickImageAsync}
        />
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
    marginTop: 100,
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
