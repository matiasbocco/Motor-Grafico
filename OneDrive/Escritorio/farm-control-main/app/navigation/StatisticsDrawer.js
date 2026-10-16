import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Statistics from "../screens/Statistics";
import StatisticsCustomDrawer from "../components/admin/StatisticsCustomDrawer";

const Drawer = createDrawerNavigator();

const StatisticsDrawer = () => {
  return (
      <Drawer.Navigator drawerContent={props => <StatisticsCustomDrawer {...props} />} screenOptions={{ drawerPosition: 'right' }}>
        <Drawer.Screen name="Statistics" component={Statistics} options={{ headerShown: false }}/>
      </Drawer.Navigator>
  );
};

export default StatisticsDrawer;