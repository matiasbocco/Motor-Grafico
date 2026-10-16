import { View, Image, StyleSheet, Text } from "react-native";
import React from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import FarmCard from "./FarmCard";
import useGlobal from "../../core/global";

const CustomDrawer = (props) => {
  const navigation = useNavigation();

  const data = useGlobal((state) => state.allFarmsData);

  const generateUniqueKey = (item, index) => `${item.nombre}-${index}`;

  const setCurrentFarm = useGlobal((state) => state.setCurrentFarm);

  const getFarmData = useGlobal((state) => state.getFarmData);

  const CalculateFarmData = (farm) => {
    let initial_quantity = 0;
    let mortality = 0;
    let sheds = 0;
    let numbers = [];

    data.forEach((item) => {
      if (item.farm === farm) {
        if (item.quantity !== undefined) {
          initial_quantity += item.quantity;
          mortality += item.mortality;
        }
        if (!numbers.includes(item.shed)) {
          numbers.push(item.shed);
          sheds++;
        }
      }
    });

    return { initial_quantity, mortality, sheds };
  };

  let farms = [];

  let result = {};

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={{ flexDirection: "row", marginTop: 10, alignItems: 'center' }}>
        <Image source={require("../../assets/icons/granero-verde.png")} style={styles.image}/>
        <Text style={styles.text}>Granjas</Text>
      </View>
      {data.map((item, index) =>
        !farms.includes(item.farm) ? (
          (farms.push(item.farm),
          (result = CalculateFarmData(item.farm)),
          (
            <FarmCard
              name={item.farm}
              initial_quantity={result.initial_quantity}
              mortality={result.mortality}
              sheds={result.sheds}
              key={generateUniqueKey(item, index)}
              onPress={() => {setCurrentFarm(item.farm); navigation.dispatch(DrawerActions.closeDrawer()); getFarmData()}}
            />
          ))
        ) : (
          <React.Fragment key={generateUniqueKey(item, index)}></React.Fragment>
        )
      )}
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;

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
})