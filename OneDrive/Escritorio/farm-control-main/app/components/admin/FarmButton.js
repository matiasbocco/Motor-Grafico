import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";

const FarmButton = ({ onPress, farm, sheds }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/icons/granero-negro.png")}
          style={styles.titleImage}
        />
        <Text style={styles.title}>Granja {farm}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.row}>
          <Image
            source={require("../../assets/icons/galpon-verde.png")}
            style={styles.image}
          />
          <Text style={styles.text}>{sheds}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FarmButton;

const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  header: {
    height: "60%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#6cf5ad",
    elevation: 2,
    alignItems: "center",
    paddingLeft: 10,
    flexDirection: "row",
    gap: 5,
  },
  titleImage: {
    height: 27,
    width: 27,
  },
  title: {
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
  body: {
    justifyContent: "space-around",
    padding: 10,
    height: "40%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
  },
});
