import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";

const FarmLister = ({ farm, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text>{farm}</Text>
    </TouchableOpacity>
  );
};

export default FarmLister;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "gray",
    width: "90%",
    height: "5%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#78b8f7",
  },
});
