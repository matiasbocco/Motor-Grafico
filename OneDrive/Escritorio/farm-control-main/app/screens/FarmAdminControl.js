import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import FarmLister from "../components/admin/FarmLister";
import { useNavigation } from "@react-navigation/native";
import useGlobal from "../core/global";

const FarmAdminControl = () => {
  const navigation = useNavigation();

  const data = useGlobal((state) => state.farmData);

  const generateUniqueKey = (item, index) => `${item.nombre}-${index}`;

  let farms = [];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F8F8F8" }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.header}>
        <Text style={{ fontFamily: "Montserrat_500Medium" }}>Granjas</Text>
      </View>
      <View style={styles.container}>
        {data.map((item, index) =>
          !farms.includes(item.farm) ? (
            (farms.push(item.farm),
            (
              <FarmLister
                farm={item.farm}
                key={generateUniqueKey(item, index)}
                onPress={() => navigation.navigate("FarmData")}
              />
            ))
          ) : (
            <React.Fragment
              key={generateUniqueKey(item, index)}
            ></React.Fragment>
          )
        )}
      </View>
    </ScrollView>
  );
};

export default FarmAdminControl;

const styles = StyleSheet.create({
  header: {
    height: "10%",
    width: "100%",
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#F8F8F8",
    height: "90%",
    alignItems: "center",
    gap: 5,
  },
});
