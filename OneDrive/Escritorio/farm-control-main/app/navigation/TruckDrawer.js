import { createDrawerNavigator } from '@react-navigation/drawer';
import SlaughterTrucker from '../screens/SlaughterTrucker';
import TruckScreen from '../screens/TruckScreen';

const Drawer = createDrawerNavigator();

const TruckDrawer = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Alimento" component={TruckScreen} options={{ headerShown: false }}/>
      <Drawer.Screen name="Faena" component={SlaughterTrucker} options={{ headerShown: false }}/>
    </Drawer.Navigator>
  );
}

export default TruckDrawer;