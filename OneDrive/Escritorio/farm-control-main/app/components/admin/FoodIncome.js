import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";

const FoodIncome = ({
  producer,
  trucker,
  farmer,
  food,
  quantity,
  date,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <View style={styles.half}>
          <View style={styles.row}>
            <Image
              source={require("../../assets/icons/calendario-verde.png")}
              style={styles.image}
            />
            <Text style={styles.text}>{date}</Text>
          </View>
          <View style={styles.row}>
            <Image
              source={require("../../assets/icons/cantidad-verde.png")}
              style={styles.image}
            />
            <Text style={styles.text}>{quantity}kg</Text>
          </View>
          <View style={styles.row}>
            <Image
              source={require("../../assets/icons/trigo-verde.png")}
              style={styles.image}
            />
            <Text style={styles.text}>{food}</Text>
          </View>
        </View>
        <View style={{ gap: 5 }}>
          <View style={styles.row}>
            <Image
              source={require("../../assets/icons/productor-verde.png")}
              style={styles.image}
            />
            <Text style={styles.text}>{producer}</Text>
          </View>
          <View style={styles.row}>
            <Image
              source={require("../../assets/icons/camion-verde.png")}
              style={styles.image}
            />
            <Text style={styles.text}>{trucker}</Text>
          </View>
          <View style={styles.row}>
            <Image
              source={require("../../assets/icons/granjero-verde.png")}
              style={styles.image}
            />
            <Text style={styles.text}>{farmer}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FoodIncome;

const styles = StyleSheet.create({
  container: {
    height: 90,
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  half: {
    width: "50%",
    gap: 5,
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
