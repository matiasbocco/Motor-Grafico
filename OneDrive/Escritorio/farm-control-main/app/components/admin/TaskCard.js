import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

const TaskCard = ({ farm, title, description, date, done, responsible }) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={styles.row}>
          <Image
            source={require("../../assets/icons/granero-verde.png")}
            style={styles.icon}
          />
          <Text style={styles.title}>
            {farm.name.charAt(0).toUpperCase() + farm.name.slice(1)}
          </Text>
        </View>
        {done && (
          <View style={styles.row}>
            <Image
              source={require("../../assets/icons/granjero-verde.png")}
              style={styles.icon}
            />
            <Text style={styles.title}>{responsible}</Text>
          </View>
        )}
      </View>
      <Text style={styles.title}>Título: {title}</Text>
      <Text style={styles.title}>Descripción: {description}</Text>
      <View style={styles.row}>
        <Image
          source={require("../../assets/icons/calendario-verde.png")}
          style={styles.icon}
        />
        <Text style={styles.title}>{date}</Text>
      </View>
    </View>
  );
};

export default TaskCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    gap: 5,
    marginTop: 3,
  },
  row: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    width: "49%",
  },
  icon: {
    width: 17,
    height: 17,
  },
  title: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
  },
});
