import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";

const PlusButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={onPress}
    >
      <Image source={require("../../assets/icons/mas.png")} style={styles.image}/>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    bottom: 20,
    right: 20,
    elevation: 2, 
    shadowColor: "#000", // Propiedades para sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    zIndex: 10,
  },
  image: {
    width: 30,
    height: 30,
  },
});

export default PlusButton;
