import { StyleSheet } from "react-native";
import React from "react";
import { Table, Row, Rows } from "react-native-table-component";

const GroupTable = ({
    day_0_mortality,
      day_4_mortality,
      day_7_mortality,
      day_14_mortality,
      day_21_mortality,
      day_28_mortality,
      day_35_mortality,
      day_42_mortality,
      day_49_mortality,
      day_0_weight,
      day_4_weight,
      day_7_weight,
      day_14_weight,
      day_21_weight,
      day_28_weight,
      day_35_weight,
      day_42_weight,
      day_49_weight,
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
    "Día 49",
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
      day_49_mortality,
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
      day_49_weight + "kg",
    ],
  ];
  return (
    <>
      <Table borderStyle={{ borderWidth: 1, borderColor: "#000" }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        <Rows data={tableData} style={styles.rows} textStyle={styles.text} />
      </Table>
    </>
  );
};

export default GroupTable;

const styles = StyleSheet.create({
  head: {
    height: 20,
    backgroundColor: "#2892fc",
  },
  rows: {
    height: 18
  },
  text: {
    fontSize: 10,
    textAlign: "center",
  },
});