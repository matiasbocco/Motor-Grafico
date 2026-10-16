import { View, Text, StyleSheet } from "react-native";
import React from "react";
import HeaderButton from "../components/HeaderButton";
import { useNavigation } from "@react-navigation/native";

const DeleteUser = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.background}>
      <View style={styles.header}>
        <HeaderButton
          onPress={() => navigation.goBack()}
          source={require("../assets/icons/flecha-izquierda.png")}
          margin={{ marginLeft: 7 }}
        />
      </View>
    </View>
  );
};

export default DeleteUser;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    height: "5%",
    width: "100%",
    backgroundColor: "#21D375",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
