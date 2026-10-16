import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { Table, Row, Rows } from "react-native-table-component";

const GroupContainer = ({
  number,
  day,
  area,
  genetic_line,
  date,
  quantity,
  sex,
  mortality,
  cabin,
  day_0_mortality,
  day_4_mortality,
  day_7_mortality,
  day_14_mortality,
  day_21_mortality,
  day_28_mortality,
  day_35_mortality,
  day_42_mortality,
  day_0_weight,
  day_4_weight,
  day_7_weight,
  day_14_weight,
  day_21_weight,
  day_28_weight,
  day_35_weight,
  day_42_weight,
}) => {
  const tableHead = [
    "Día 0",
    "Día 4",
    "Día 7",
    "Día 14",
    "Día 21",
    "Día 28",
    "Día 35",
    "Día 42",
  ];
  const tableData = [
    [
      day_0_mortality,
      day_4_mortality,
      day_7_mortality,
      day_14_mortality,
      day_21_mortality,
      day_28_mortality,
      day_35_mortality,
      day_42_mortality,
    ],
    [
      day_0_weight + "kg",
      day_4_weight + "kg",
      day_7_weight + "kg",
      day_14_weight + "kg",
      day_21_weight + "kg",
      day_28_weight + "kg",
      day_35_weight + "kg",
      day_42_weight + "kg",
    ],
  ];
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <Text>Grupo {number}</Text>
        <Text>Día {day}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          justifyContent: "space-between",
        }}
      >
        <View style={styles.data}>
          <Image
            source={require("../../assets/icons/calendario-verde.png")}
            style={styles.image}
          />
          <Text>{date}</Text>
        </View>
        <View style={styles.data}>
          <Image
            source={require("../../assets/icons/area-verde.png")}
            style={styles.image}
          />
          <Text>{area}</Text>
        </View>
        <View style={styles.data}>
          <Image
            source={require("../../assets/icons/adn-verde.png")}
            style={styles.image}
          />
          <Text>{genetic_line}</Text>
        </View>
        <View style={styles.data}>
          <Image
            source={require("../../assets/icons/pollo-verde.png")}
            style={styles.image}
          />
          <Text>{quantity}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          justifyContent: "space-between",
        }}
      >
        <View style={styles.data}>
          <Image
            source={require("../../assets/icons/sexo-verde.png")}
            style={styles.image}
          />
          <Text>{sex}</Text>
        </View>
        <View style={styles.data}>
          <Image
            source={require("../../assets/icons/craneo-verde.png")}
            style={styles.image}
          />
          <Text>{mortality}</Text>
        </View>
        <View style={styles.data}>
          <Image
            source={require("../../assets/icons/cabana-verde.png")}
            style={styles.image}
          />
          <Text>{cabin}</Text>
        </View>
      </View>
      <Text style={styles.daylyTitle}>Mortalidad y Peso</Text>
      <View style={styles.dayly}>
        <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={tableData} style={styles.rows} textStyle={styles.text} />
        </Table>
      </View>
    </View>
  );
};

export default GroupContainer;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    padding: 10,
    gap: 5,
  },
  image: {
    width: 22,
    height: 22,
  },
  data: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
  },
  dayly: {
    marginTop: 5,
    marginBottom: 5,
  },
  head: {
    height: "fit-content",
    backgroundColor: "#FFFFFF",
    width: "fit-content",
  },
  daylyTitle: {
    marginTop: 5,
  },
  rows: {
    height: "fit-content",
    width: "fit-content",
  },
  text: {
    textAlign: "center",
    fontSize: 10,
  },
});
