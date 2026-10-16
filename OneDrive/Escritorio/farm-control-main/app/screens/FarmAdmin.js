import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import useGlobal from "../core/global";
import ImageButton from "../components/admin/ImageButton";
import { useNavigation } from "@react-navigation/native";
import HeaderButton from "../components/HeaderButton";
import NotificationComponent from "../components/Notification";
import RunNotifications from "../components/Push";

const FarmAdminScreen = () => {
  const getSheds = useGlobal((state) => state.getSheds);
  const getAllFarmsData = useGlobal((state) => state.getAllFarmsData);
  const getFood = useGlobal((state) => state.getFood);
  const getActiveBatches = useGlobal((state) => state.getActiveBatches);
  const getAdminFarms = useGlobal((state) => state.getAdminFarms);
  const getStatistics = useGlobal((state) => state.getStatistics);
  const logout = useGlobal((state) => state.logout);

  const navigation = useNavigation();

  useEffect(() => {
    getSheds();
    getAllFarmsData();
    getFood();
    getActiveBatches();
    getAdminFarms();
    getStatistics();
  }, [getSheds, getAllFarmsData, getFood, getActiveBatches, getAdminFarms, getStatistics]);

  return (
      <View style={styles.background}>
        <RunNotifications/>
      <View style={styles.header}>
        <HeaderButton
          source={require("../assets/icons/salida.png")}
          onPress={() => logout()}
          margin={{ marginLeft: "90%" }}
        />
      </View>
      <View style={{ height: "24.5%" }}></View>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <ImageButton
            source={require("../assets/icons/pollitos-verde.png")}
            text={"Producción"}
            onPress={() => navigation.navigate("FarmData")}
          />
          <ImageButton
            source={require("../assets/icons/administracion-verde.png")}
            text={"Usuarios"}
            onPress={() => navigation.navigate("User")}
          />
          <ImageButton
            source={require("../assets/icons/carga-verde.png")}
            text={"Cargas Faena"}
            onPress={() => navigation.navigate("SlaughterLoad")}
          />
          <ImageButton
            source={require("../assets/icons/grafico-de-barras-verde.png")}
            text={"Estadísticas"}
            onPress={() => navigation.navigate("Statistics")}
          />
        </View>
        <View style={[styles.cardContainer, { marginTop: 10 }]}>
          <ImageButton
            source={require("../assets/icons/trigo-verde.png")}
            text={"Alimento"}
            onPress={() => navigation.navigate("FoodAdmin")}
          />
          <ImageButton
            source={require("../assets/icons/pollo-verde.png")}
            text={"Lotes"}
            onPress={() => navigation.navigate("BatchAdmin")}
          />
          <ImageButton
            source={require("../assets/icons/granero-verde.png")}
            text={"Granjas"}
            onPress={() => navigation.navigate("Sheds")}
          />
          <ImageButton
            source={require("../assets/icons/tarea-verde.png")}
            text={"Tareas"}
            onPress={() => navigation.navigate("Tasks")}
          />
        </View>
      </View>
    </View>
  );
};

export default FarmAdminScreen;

styles = StyleSheet.create({
  background: {
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  header: {
    height: "5.5%",
    backgroundColor: "#21D375",
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    height: "70%",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
