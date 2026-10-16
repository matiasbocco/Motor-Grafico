import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EntryInput from "../components/food/EntryInput";
import ProductionInput from "../components/food/ProductionInput";
import DeliveryInput from "../components/food/DeliveryInput";
import HeaderButton from "../components/HeaderButton";
import NotificationComponent from "../components/Notification";
import useGlobal from "../core/global";
import Announcement from "../components/farmer/Announcement";
import NotificationBell from "../components/NotificationBell";

const FoodEmployeeScreen = () => {

  const user = useGlobal((state) => state.user)
  
  const [inputContent, setInputContent] = useState([
    { id: 1, content: <EntryInput /> },
    { id: 2, content: <ProductionInput /> },
    { id: 3, content: <DeliveryInput /> },
  ]);

  const [currentInput, setCurrentInput] = useState(1);

  const [selectedButton, setSelectedButton] = useState(1);

  const generateUniqueKey = (item, index) => `${item.nombre}-${index}`;
  const logout = useGlobal((state) => state.logout);

  const handlePress = (buttonId) => {
    setSelectedButton(buttonId); // Establecer el botón actualmente seleccionado
    setCurrentInput(buttonId);
  };

  const isButtonSelected = (buttonId) => {
    return selectedButton === buttonId;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
        <HeaderButton
          onPress={() => sendGroup()}
          source={require("../assets/icon.png")}
          margin={{ marginLeft: 7 }}
        />
        <Text style={{ fontFamily: "Montserrat_500Medium", marginLeft: "20%" }}>
          {user.name}
        </Text>
        <NotificationBell
          count={0}
          // onPress={handleNotificationPress}
        />
        <HeaderButton
          onPress={() => logout()}
          source={require("../assets/icons/logout.png")}
          margin={{ marginRight: 7, marginLeft: 15 }}
        />
        </View>
        <View style={styles.news}>
          <Announcement
            title="Anuncio"
            body="Descripcion de prueba"
          />
        </View>
        <View style={styles.space}>
          <View style={styles.inputSelector}>
            <TouchableOpacity
              style={[
                styles.button,
                isButtonSelected(1) && styles.selectedButton,
                styles.leftButton,
              ]}
              onPress={() => handlePress(1)}
            >
              <Text style={styles.buttonText}>INGRESO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                isButtonSelected(2) && styles.selectedButton,
              ]}
              onPress={() => handlePress(2)}
            >
              <Text style={styles.buttonText}>PRODUCCIÓN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                isButtonSelected(3) && styles.selectedButton,
                styles.rightButton,
              ]}
              onPress={() => handlePress(3)}
            >
              <Text style={styles.buttonText}>ENTREGA</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productContainer}>
            {inputContent.map(
              (item, index) =>
                currentInput === item.id && (
                  <View key={generateUniqueKey(item, index)}>
                    {item.content}
                  </View>
                )
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default FoodEmployeeScreen;

const styles = StyleSheet.create({
  header: {
    height: "10%",
    width: "100%",
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  space: {
    padding: 10,
    width: "100%",
    height: "100%",
    backgroundColor: "%F8F8F8",
  },
  news: {
    height: "20%",
    width: "100%",
    backgroundColor: "#F8F8F8",
    padding: 10,
  },
  inputSelector: {
    height: "8%",
    width: "100%",
    backgroundColor: "#F8F8F8",
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    height: "100%",
    width: "30%",
    backgroundColor: "#78b8f7",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#2892fc",
  },
  buttonText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 12.5,
  },
  leftButton: {
    borderTopLeftRadius: 23,
  },
  rightButton: {
    borderTopRightRadius: 23,
  },
  productContainer: {
    height: "61.5%",
    width: "100%",
    overFlow: "hidden",
    backgroundColor: "#2892fc",
    borderRadius: 10,
  },
});
