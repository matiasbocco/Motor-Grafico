import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import HeaderButton from "../components/HeaderButton";
import { useNavigation } from "@react-navigation/native";

const User = () => {

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
      <View style={styles.container}>
        <TouchableOpacity style={[styles.button, { marginTop: "50%" }]} onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.text}>Crear Nuevo Usuario</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("DeleteUser")}>
          <Text style={styles.text}>Eliminar Un Usuario</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#F5F5F5"
  },
  header: {
    height: "5%",
    width: "100%",
    backgroundColor: "#21D375",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    width: "70%",
    height: 60,
    backgroundColor: "#FFFFFF",
    elevation: 5,
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 20
  },
  text: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14
  },
});
