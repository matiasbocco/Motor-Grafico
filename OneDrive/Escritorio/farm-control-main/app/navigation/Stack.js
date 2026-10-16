import { createStackNavigator } from "@react-navigation/stack";
import { useState } from "react";
import FarmerScreen from "../screens/Farmer";
import FoodEmployeeScreen from "../screens/FoodEmployeeScreen";
import TruckScreen from "../screens/TruckScreen";
import ShedUploadScreen from "../screens/ShedUploadScreen";
import SignIn from "../screens/SignIn";
import FarmAdminScreen from "../screens/FarmAdmin";
import useGlobal from "../core/global";
import DrawerNavigator from "./Drawer";
import User from "../screens/User";
import SignUp from "../screens/SignUp";
import Notifications from "../screens/Notifications";
import RemitDetailScreen from "../screens/RemitDetailScreen";
import SlaughterTrucker from "../screens/SlaughterTrucker";
import BatchAdmin from "../screens/BatchAdmin";
import FoodDrawer from "./FoodDrawer";
import IncomeAdmin from "../screens/IncomeAdmin";
import BatchDetail from "../screens/BatchDetail";
import Sheds from "../screens/Sheds";
import FarmDetail from "../screens/FarmDetail";
import StatisticsDrawer from "./StatisticsDrawer";
import Tasks from "../screens/Tasks";
import DeleteUser from "../screens/DeleteUser";
import * as React from "react";
import SlaughterLoad from "../screens/SlaughterLoad";
import TruckDrawer from "./TruckDrawer";

const Stack = createStackNavigator();

export const HomeStack = () => {
  const authenticated = useGlobal((state) => state.authenticated);

  const init = useGlobal((state) => state.init);
  const admin = useGlobal((state) => state.admin);
  const farmer = useGlobal((state) => state.farmer);
  const trucker = useGlobal((state) => state.trucker);
  const producer = useGlobal((state) => state.producer);
  const replacement = useGlobal((state) => state.replacement);
  const slaughterTrucker = useGlobal((state) => state.slaughterTrucker);

  init();

  return (
    <Stack.Navigator>
      {!authenticated ? (
        <>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          {admin && (
            <Stack.Screen
              name="FarmAdmin"
              component={FarmAdminScreen}
              options={{ headerShown: false }}
            />
          )}
          {farmer && (
            <Stack.Screen
              name="Farmer"
              component={FarmerScreen}
              options={{ headerShown: false }}
            />
          )}
          {trucker && (
            <Stack.Screen
              name="Truck"
              component={TruckScreen}
              options={{ headerShown: false }}
            />
          )}
          {producer && (
            <Stack.Screen
              name="Food"
              component={FoodEmployeeScreen}
              options={{ headerShown: false }}
            />
          )}
          {slaughterTrucker && (
            <Stack.Screen
              name="slaghter"
              component={SlaughterTrucker}
              options={{ headerShown: false }}
            />
          )}
          {replacement && (
            <Stack.Screen
              name="Replacement"
              component={TruckDrawer}
              options={{ headerShown: false }}
            />
          )}
          <Stack.Screen
            name="ShedUpload"
            component={ShedUploadScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="User"
            component={User}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FarmData"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Notifications"
            component={Notifications}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RemitDetail"
            component={RemitDetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FoodAdmin"
            component={FoodDrawer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BatchAdmin"
            component={BatchAdmin}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Income"
            component={IncomeAdmin}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BatchDetail"
            component={BatchDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Sheds"
            component={Sheds}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FarmDetail"
            component={FarmDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Statistics"
            component={StatisticsDrawer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Tasks"
            component={Tasks}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DeleteUser"
            component={DeleteUser}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SlaughterLoad"
            component={SlaughterLoad}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
