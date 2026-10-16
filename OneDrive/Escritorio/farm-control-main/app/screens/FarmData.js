import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import HeaderButton from "../components/HeaderButton";
import useGlobal from "../core/global";
import ShedContainer from "../components/admin/ShedContainer";

const FarmData = () => {
  const navigation = useNavigation();

  const data = useGlobal((state) => state.sheds);

  const currentFarm = useGlobal((state) => state.currentFarm);

  const setCurrentFarm = useGlobal((state) => state.setCurrentFarm);

  const farmAdminData = useGlobal((state) => state.farmAdminData);

  const getFarmData = useGlobal((state) => state.getFarmData);

  let listedFarms = [];

  let sheds = [];

  const SetFarm = (data) => {
    data.forEach((item) => {
      if (!listedFarms.includes(item.farm)) {
        listedFarms.push(item.farm);
      }
    });
    setCurrentFarm(listedFarms[0]);

    getFarmData();
  };

  useEffect(() => {
    SetFarm(data);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <HeaderButton
          onPress={() => navigation.goBack()}
          source={require("../assets/icons/flecha-izquierda.png")}
          margin={{ marginLeft: 7 }}
        />
        <Text style={{ fontFamily: "Montserrat_500Medium" }}>
        Granja {currentFarm ? (currentFarm.charAt(0).toUpperCase() + currentFarm.slice(1)) : ""}
        </Text>
        <HeaderButton
          onPress={() => navigation.openDrawer()}
          source={require("../assets/icons/menu.png")}
          margin={{ marginRight: 7 }}
        />
      </View>
      <ScrollView>
      <View style={{ alignItems: "center" }}>
        {farmAdminData ? (farmAdminData.map(
          (item, index) =>
            !sheds.includes(item.shed) &&
            (sheds.push(item.shed),
            (
              <ShedContainer
                data={farmAdminData.filter((data) => data.shed === item.shed)}
                number={item.shed}
                key={index}
              />
            ))
        )) : (<Text>No hay granjas creadas.</Text>)}
      </View>
      </ScrollView>
    </View>
  );
};

export default FarmData;

const styles = StyleSheet.create({
  header: {
    height: "6%",
    width: "100%",
    backgroundColor: "#21D375",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
