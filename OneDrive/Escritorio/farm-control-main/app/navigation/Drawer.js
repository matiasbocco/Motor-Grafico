import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import FarmData from "../screens/FarmData";
import CustomDrawer from "../components/admin/CustomDrawer";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
      <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} screenOptions={{ drawerPosition: 'right' }}>
        <Drawer.Screen name="Granja" component={FarmData} options={{ headerShown: false }}/>
      </Drawer.Navigator>
  );
};

export default DrawerNavigator;
