import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import FoodAdmin from "../screens/FoodAdmin";
import FoodCustomDrawer from "../components/admin/FoodCustomDrawer";

const Drawer = createDrawerNavigator();

const FoodDrawer = () => {
  return (
      <Drawer.Navigator drawerContent={props => <FoodCustomDrawer {...props} />} screenOptions={{ drawerPosition: 'right' }}>
        <Drawer.Screen name="Food" component={FoodAdmin} options={{ headerShown: false }}/>
      </Drawer.Navigator>
  );
};

export default FoodDrawer;
