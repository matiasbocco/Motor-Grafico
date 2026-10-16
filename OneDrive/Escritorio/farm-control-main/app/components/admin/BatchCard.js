import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";

const BatchCard = ({ onPress, farm, day, date }) => {
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
            source={require("../../assets/icons/calendario-verde.png")}
            style={styles.image}
          />
          <Text style={styles.text}>{date}</Text>
        </View>
        <View style={styles.row}>
          <Image
            source={require("../../assets/icons/sol-verde.png")}
            style={styles.image}
          />
          <Text style={styles.text}>Día: {day}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BatchCard;

const styles = StyleSheet.create({
  container: {
    height: 120,
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  header: {
    height: "30%",
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
    height: "70%",
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
