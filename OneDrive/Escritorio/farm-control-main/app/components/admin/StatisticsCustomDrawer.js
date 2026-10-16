import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import useGlobal from "../../core/global";

const StatisticsCustomDrawer = (props) => {
  const navigation = useNavigation();
  const farms = useGlobal((state) => state.farms);
  const setCurrentFarm = useGlobal((state) => state.setCurrentFarm);
  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={{ gap: 10 }}>
        <View
          style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}
        >
          <Image
            source={require("../../assets/icons/granero-verde.png")}
            style={styles.image}
          />
          <Text style={styles.text}>Granjas</Text>
        </View>
        {farms.map((farm, index) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              setCurrentFarm(farm.name);
              navigation.dispatch(DrawerActions.closeDrawer());
            }}
          >
            <Text style={{ fontFamily: "Montserrat_500Medium" }}>
              {farm.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </DrawerContentScrollView>
  );
};

export default StatisticsCustomDrawer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    gap: 10,
  },
  text: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    marginLeft: 5,
  },
  image: {
    height: 20,
    width: 20,
    marginLeft: "2.5%",
  },
  card: {
    width: "95%",
    backgroundColor: "#6cf5ad",
    marginLeft: "2.5%",
    padding: 10,
    borderRadius: 10,
  },
});
