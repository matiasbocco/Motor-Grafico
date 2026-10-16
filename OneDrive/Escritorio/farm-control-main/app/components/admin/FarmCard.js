import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";

const FarmCard = ({ name, initial_quantity, mortality, sheds, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View>
        <Text>{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
      </View>
      <View style={styles.data}>
        <Image
          source={require("../../assets/icons/pollo-negro.png")}
          style={styles.image}
        />
        <Text style={styles.number}>
          {initial_quantity.toLocaleString("es-ES")}
        </Text>
        <Image
          source={require("../../assets/icons/craneo.png")}
          style={[styles.image, styles.margin]}
        />
        <Text style={styles.number}>{mortality.toLocaleString("es-ES")}</Text>
        <Image
          source={require("../../assets/icons/galpon.png")}
          style={[styles.image, styles.margin]}
        />
        <Text style={styles.number}>{sheds.toLocaleString("es-ES")}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default FarmCard;

const styles = StyleSheet.create({
  container: {
    width: "95%",
    backgroundColor: "#6cf5ad",
    height: 100,
    borderRadius: 10,
    marginLeft: "2.5%",
    padding: 10,
    marginTop: 10
  },
  image: {
    height: 20,
    width: 20,
  },
  number: {
    fontSize: 11,
  },
  data: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 35,
  },
  margin: {
    marginLeft: 15,
  },
});
