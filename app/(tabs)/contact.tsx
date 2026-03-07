import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";


export default function contact() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Contact screen</Text>
      <Image style={styles.image}
      source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI-PKOYFjaCBVh7PS9cWAQ5h4pEUTjAU7mMQ&s"}}/>
      <Link href="/" style={styles.buttonContact}>
        Devuelvase a home
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height:  200,
    
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },

  text: {
    fontSize: 30,
    backgroundColor: "red",
  },

  buttonContact: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
});
