import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";

const FarmCard = ({
  farm,
  preStarter,
  starter,
  terminator,
  lastWeek,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View>
        <Text>{farm.charAt(0).toUpperCase() + farm.slice(1)}</Text>
      </View>
      <View style={styles.data}>
        <View style={styles.row}>
          <Image
            style={styles.image}
            source={require("../../assets/icons/food.png")}
          />
          <Text style={styles.number}>
            Pre-Iniciador: {preStarter.toLocaleString("es-ES")}kg
          </Text>
        </View>
        <View style={styles.row}>
          <Image
            style={styles.image}
            source={require("../../assets/icons/food.png")}
          />
          <Text style={styles.number}>
            Iniciador: {starter.toLocaleString("es-ES")}kg
          </Text>
        </View>
        <View style={styles.row}>
          <Image
            style={styles.image}
            source={require("../../assets/icons/food.png")}
          />
          <Text style={styles.number}>
            Terminador: {terminator.toLocaleString("es-ES")}kg
          </Text>
        </View>
        <View style={styles.row}>
          <Image
            style={styles.image}
            source={require("../../assets/icons/food.png")}
          />
          <Text style={styles.number}>
            Última Semana: {lastWeek.toLocaleString("es-ES")}kg
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FarmCard;

const styles = StyleSheet.create({
  container: {
    width: "95%",
    backgroundColor: "#6cf5ad",
    height: 130,
    borderRadius: 10,
    marginLeft: "2.5%",
    padding: 10,
    marginTop: 10,
  },
  image: {
    height: 20,
    width: 20,
  },
  number: {
    fontSize: 12,
  },
  data: {
    gap: 3,
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    gap: 3,
  },
});
