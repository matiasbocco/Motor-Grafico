import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import FoodCard from "./FoodCard";
import useGlobal from "../../core/global";

const FoodCustomDrawer = (props) => {
  const navigation = useNavigation();

  const data = useGlobal((state) => state.food);

  const setCurrentFarm = useGlobal((state) => state.setCurrentFarm);

  const getFarmFood = useGlobal((state) => state.getFarmFood);

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View
        style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}
      >
        <Image
          source={require("../../assets/icons/granero-verde.png")}
          style={styles.image}
        />
        <Text style={styles.text}>Granjas</Text>
      </View>
      {data.map((item, index) => (
        <FoodCard
          key={index}
          farm={item.farm}
          preStarter={item.pre_starter_quantity}
          starter={item.starter_quantity}
          terminator={item.terminator_quantity}
          lastWeek={item.last_week_quantity}
          onPress={() => {
            setCurrentFarm(item.farm);
            getFarmFood();
            navigation.dispatch(DrawerActions.closeDrawer());
          }}
        />
      ))}
    </DrawerContentScrollView>
  );
};

export default FoodCustomDrawer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
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
});
