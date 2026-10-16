import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";

const ImageButton = ({ source, text, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={source} style={styles.image} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default ImageButton;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    height: 65,
    width: "19%",
    backgroundColor: "#FFFFFF",
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 1 }, // Desplazamiento de la sombra
    shadowOpacity: 0.2, // Opacidad de la sombra
    shadowRadius: 1, // Radio de la sombra
  },
  image: {
    height: 40,
    width: 40,
    alignSelf: "center",
  },
  text: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 9,
    color: "#4E4E4E",
    textAlign: "center",
  },
});
