import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import useGlobal from "../core/global";
import { useNavigation } from "@react-navigation/native";
import HeaderButton from "../components/HeaderButton";
import FoodIncome from "../components/admin/FoodIncome";

const FoodAdmin = () => {
  const navigation = useNavigation();

  const data = useGlobal((state) => state.farmFood);

  // Verifica si 'data' está definido y no es null
  const quantities = Array.isArray(data) ? data.find((obj) => obj.hasOwnProperty("pre_starter_quantity")) || {} : {};


  const incomes = Array.isArray(data) ? data.filter((obj) => obj.hasOwnProperty("production")) : [];

  const farms = useGlobal((state) => state.sheds);

  const currentFarm = useGlobal((state) => state.currentFarm);

  const setCurrentFarm = useGlobal((state) => state.setCurrentFarm);

  const getFarmFood = useGlobal((state) => state.getFarmFood);

  const setIncome = useGlobal((state) => state.setIncome);

  let listedFarms = [];

  const SetFarm = (farms) => {
    farms.forEach((item) => {
      if (!listedFarms.includes(item.farm)) {
        listedFarms.push(item.farm);
      }
    });
    setCurrentFarm(listedFarms[0]);

    getFarmFood();
  };

  useEffect(() => {
    SetFarm(farms);
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F8F8F8" }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.header}>
        <HeaderButton
          onPress={() => navigation.goBack()}
          source={require("../assets/icons/flecha-izquierda.png")}
          margin={{ marginLeft: 7 }}
        />
        <Text style={styles.title}>
          Granja {currentFarm ? (currentFarm.charAt(0).toUpperCase() + currentFarm.slice(1)) : ""}
        </Text>
        <HeaderButton
          onPress={() => navigation.openDrawer()}
          source={require("../assets/icons/menu.png")}
          margin={{ marginRight: 7 }}
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.subtitle}>Alimento Recibido</Text>
        <View style={styles.row}>
          <Image
            source={require("../assets/icons/food.png")}
            style={styles.image}
          />
          <Text style={styles.data}>
            Pre-Iniciador: {quantities.pre_starter_quantity || 0}kg
          </Text>
        </View>
        <View style={styles.row}>
          <Image
            source={require("../assets/icons/food.png")}
            style={styles.image}
          />
          <Text style={styles.data}>
            Iniciador: {quantities.starter_quantity || 0}kg
          </Text>
        </View>
        <View style={styles.row}>
          <Image
            source={require("../assets/icons/food.png")}
            style={styles.image}
          />
          <Text style={styles.data}>
            Terminador: {quantities.terminator_quantity || 0}kg
          </Text>
        </View>
        <View style={styles.row}>
          <Image
            source={require("../assets/icons/food.png")}
            style={styles.image}
          />
          <Text style={styles.data}>
            Última Semana: {quantities.last_week_quantity || 0}kg
          </Text>
        </View>
      </View>
      <View style={styles.incomes}>
        <Text style={[styles.subtitle, { marginBottom: 10 }]}>
          Ingresos Registrados
        </Text>
        {incomes.map((item, index) => (
          <FoodIncome
            key={index}
            date={item.receipt_date}
            quantity={item.receipt.quantity}
            food={item.receipt.food_type}
            producer={item.producer}
            trucker={item.trucker}
            farmer={item.farmer}
            onPress={() => {
              navigation.navigate("Income");
              setIncome(item);
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default FoodAdmin;

const styles = StyleSheet.create({
  header: {
    height: "6%",
    width: "100%",
    backgroundColor: "#21D375",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#4AE28E",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  subtitle: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 17,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingLeft: 10,
  },
  image: {
    height: 35,
    width: 35,
  },
  data: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    marginLeft: 10,
  },
  incomes: {
    marginHorizontal: 10,
  },
});
