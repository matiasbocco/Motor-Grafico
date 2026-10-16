import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderButton from "../components/HeaderButton";
import NotificationComponent from "../components/Notification";
import Delivery from "../components/truck/Delivery";
import RunNotifications from "../components/Push";
import Announcement from "../components/farmer/Announcement";
import { useNavigation } from "@react-navigation/native";
import useGlobal from "../core/global";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import Remits from "../components/truck/Remits";

const TruckScreen = () => {
  const [inputContent, setInputContent] = useState([
    { id: 1, content: <Remits /> },
    { id: 2, content: <Delivery /> },
  ]);
  
  const [refreshing, setRefreshing] = useState(false);
  const refreshTruckScreen = useGlobal((state) => state.refreshTruckScreen);

  const onRefresh = async () => {
    setRefreshing(true);
    refreshTruckScreen();
    setRefreshing(false);
  };

  const [currentInput, setCurrentInput] = useState(1);

  const [selectedButton, setSelectedButton] = useState(1);

  const logout = useGlobal((state) => state.logout);
  const replacement = useGlobal((state) => state.replacement);
  const userFullName = useGlobal((state) => state.user.name);

  const generateUniqueKey = (item, index) => `${item.nombre}-${index}`;

  const handlePress = (buttonId) => {
    setSelectedButton(buttonId); // Establecer el botón actualmente seleccionado
    setCurrentInput(buttonId);
  };

  const isButtonSelected = (buttonId) => {
    return selectedButton === buttonId;
  };

  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <HeaderButton
            onPress={replacement ? (() => navigation.openDrawer()) : console.log("")}
            source={replacement ? require("../assets/icons/menu.png") : require("../assets/icon.png")}
            margin={{ marginLeft: 7 }}
          />
          <Text
            style={{ fontFamily: "Montserrat_500Medium", marginLeft: "20%" }}
          >
            {userFullName}
          </Text>
          <NotificationComponent
            source={require("../assets/icons/packard-bell.png")}
          />
          <HeaderButton
            onPress={() => logout()}
            source={require("../assets/icons/salida.png")}
            margin={{ marginRight: 7, marginLeft: 15 }}
          />
        </View>
        <View style={styles.news}>
          <RunNotifications />
          <Announcement title={"Anuncio"} body={"Descripcion de prueba"} />
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
              <Text style={styles.buttonText}>REMITOS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                isButtonSelected(2) && styles.selectedButton,
                styles.rightButton,
              ]}
              onPress={() => handlePress(2)}
            >
              <Text style={styles.buttonText}>COMBUSTIBLE</Text>
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
};

export default TruckScreen;

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
    width: "40%",
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
