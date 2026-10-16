import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderButton from "../components/HeaderButton";
import NotificationComponent from "../components/Notification";
import Announcement from "../components/farmer/Announcement";
import RunNotifications from "../components/Push";
import useGlobal from "../core/global";
import DropDownMenu from "../components/DropDownMenu";
import TimedModal from "../components/TimedModal";
import { useNavigation } from "@react-navigation/native";

const SlaughterTrucker = () => {
  const [farm, setFarm] = useState(null);
  const [farmError, setFarmError] = useState("");
  const [farmItem, setFarmItem] = useState([]);
  const [shed, setShed] = useState("");
  const [shedError, setShedError] = useState("");
  const [chicken, setChicken] = useState("");
  const [chickenError, setChickenError] = useState("");
  const [tare, setTare] = useState("");
  const [tareError, setTareError] = useState("");
  const [grossWeight, setGrossWeight] = useState("");
  const [grossWeightError, setGrossWeightError] = useState("");
  const [truck, setTruck] = useState("");
  const [truckError, setTruckError] = useState("");
  const [client, setClient] = useState("");
  const [clientError, setClientError] = useState("");

  const userFullName = useGlobal((state) => state.user.name);
  const logout = useGlobal((state) => state.logout);
  const getFarms = useGlobal((state) => state.getFarms);
  const sendSlaughter = useGlobal((state) => state.sendSlaughter);
  const modalVisible = useGlobal((state) => state.modalVisible);
  const showModal = useGlobal((state) => state.showModal);
  const closeModal = useGlobal((state) => state.closeModal);
  const response = useGlobal((state) => state.response);
  const replacement = useGlobal((state) => state.replacement);

  const navigation = useNavigation();

  const handlePress = () => {
    let error = false;
    let errorText = "";

    const notFarm = !farm;
    if (notFarm) {
      setFarmError("Ingrese una granja");
      error = true;
      errorText += farmError + " ";
    }

    const notShed = !shed;
    if (notShed) {
      setShedError("Ingrese el número de galpón");
      error = true;
      errorText += shedError + " ";
    }
    const failShed = /[a-zA-Z]/.test(shed);
    if (failShed) {
      setShedError("El galpón ingresado no es válido");
      error = true;
      if (errorText !== "") {
        errorText += ", " + shedError + " ";
      } else {
        errorText += shedError + " ";
      }
    }

    const notChicken = !chicken;
    if (notChicken) {
      setChickenError("Ingrese la cantidad de pollos");
      error = true;
      errorText += chickenError + " ";
    }
    const failChicken = /[a-zA-Z]/.test(chicken);
    if (failChicken) {
      setChickenError("La cantidad ingresada no es válida");
      error = true;
      if (errorText !== "") {
        errorText += ", " + chickenError + " ";
      } else {
        errorText += chickenError + " ";
      }
    }

    const notTare = !tare;
    if (notTare) {
      setTareError("Ingrese la tara del camión");
      error = true;
      errorText += tareError + " ";
    }
    const failTare = /[a-zA-Z]/.test(tare);
    if (failTare) {
      setTareError("La tara ingresada no es válida");
      error = true;
      if (errorText !== "") {
        errorText += ", " + tareError + " ";
      } else {
        errorText += tareError + " ";
      }
    }

    const notGrossWeight = !grossWeight;
    if (notGrossWeight) {
      setGrossWeightError("Ingrese la tara del camión");
      error = true;
      errorText += grossWeightError + " ";
    }
    const failGrossWeight = /[a-zA-Z]/.test(grossWeight);
    if (failGrossWeight) {
      setGrossWeightError("La tara ingresada no es válida");
      error = true;
      if (errorText !== "") {
        errorText += ", " + grossWeightError + " ";
      } else {
        errorText += grossWeightError + " ";
      }
    }

    const notClient = !client;
    if (notClient) {
      setClientError("Ingrese el cliente");
      error = true;
      errorText += clientError + " ";
    }

    const notTruck = !truck;
    if (notTruck) {
      setTruckError("Ingrese el camión");
      error = true;
      errorText += truckError + " ";
    }

    if (error) {
      return;
    }
    sendSlaughter(farm, shed, chicken, tare, grossWeight, truck, client);
    setFarm(null);
    setChicken("");
    setShed("");
    setTare("");
    setGrossWeight("");
    setTruck("");
    setClient("");
    showModal();
  };

  useEffect(() => {
    const fetchFarms = async () => {
      const farms = await getFarms();
      setFarmItem(farms);
    };

    fetchFarms();
  }, [getFarms]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
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
          <View style={styles.card}>
            <Text style={styles.title}>REGISTRO DE CARGA</Text>
            <View style={styles.inputContainer}>
              <Text style={[styles.subtitle, { color: farmError ? "red" : "black" }]}>
                {farmError ? farmError : "Granja"}
              </Text>
              <DropDownMenu
                icon={true}
                source={require("../assets/icons/granero-azul.png")}
                title={"Granja"}
                height={45}
                data={farmItem}
                value={farm}
                onChange={setFarm}
              />
              <View style={styles.row}>
                <View style={[styles.split, { paddingRight: 5 }]}>
                  <Text
                    style={[styles.subtitle, { color: shedError ? "red" : "black" }]}
                  >
                    {shedError ? shedError : "Galpón"}
                  </Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    value={shed}
                    onChangeText={(text) => {
                      setShed(text);
                      if (shedError) {
                        setShedError("");
                      }
                    }}
                  />
                </View>
                <View style={[styles.split, { paddingLeft: 5 }]}>
                  <Text
                    style={[styles.subtitle, { color: chickenError ? "red" : "black" }]}
                  >
                    {chickenError ? chickenError : "Pollos Cargados"}
                  </Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    value={chicken}
                    onChangeText={(text) => {
                      setChicken(text);
                      if (chickenError) {
                        setChickenError("");
                      }
                    }}
                  />
                </View>
              </View>
              <View style={[styles.row, { marginBottom: 10 }]}>
                <View style={[styles.split, { paddingRight: 5 }]}>
                  <Text
                    style={[styles.subtitle, { color: tareError ? "red" : "black" }]}
                  >
                    {tareError ? tareError : "Tara"}
                  </Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    value={tare}
                    onChangeText={(text) => {
                      setTare(text);
                      if (tareError) {
                        setTareError("");
                      }
                    }}
                  />
                </View>
                <View style={[styles.split, { paddingLeft: 5 }]}>
                  <Text
                    style={[
                      styles.subtitle,
                      { color: grossWeightError ? "red" : "black" },
                    ]}
                  >
                    {grossWeightError ? grossWeightError : "Peso Bruto"}
                  </Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    value={grossWeight}
                    onChangeText={(text) => {
                      setGrossWeight(text);
                      if (grossWeightError) {
                        setGrossWeightError("");
                      }
                    }}
                  />
                </View>
              </View>
              <Text style={[styles.subtitle, { color: clientError ? "red" : "black" }]}>
                {clientError ? clientError : "Cliente"}
              </Text>
              <TextInput
                style={styles.input}
                value={client}
                onChangeText={(text) => {
                  setClient(text);
                  if (clientError) {
                    setClientError("");
                  }
                }}
              />
              <Text style={[styles.subtitle, { color: truckError ? "red" : "black" }]}>
                {truckError ? truckError : "Camión"}
              </Text>
              <TextInput
                style={styles.input}
                value={truck}
                onChangeText={(text) => {
                  setTruck(text);
                  if (truckError) {
                    setTruckError("");
                  }
                }}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => handlePress()}
              >
                <Text style={styles.buttonText}>Registrar Carga</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TimedModal
            visible={modalVisible}
            onClose={() => {
              closeModal();
            }}
            duration={3500}
            title={response.title}
            description={response.message}
            status={response.status}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SlaughterTrucker;

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
    height: "70%",
    backgroundColor: "#F8F8F8",
  },
  news: {
    height: "20%",
    width: "100%",
    backgroundColor: "#F8F8F8",
    padding: 10,
  },
  card: {
    height: "100%",
    width: "100%",
    backgroundColor: "#2892fc",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: "Montserrat_500Medium",
    fontWeight: "bold",
    marginTop: -5,
  },
  inputContainer: {
    height: "95%",
    width: "100%",
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Montserrat_500Medium",
  },
  row: {
    flexDirection: "row",
    marginTop: 10,
  },
  split: {
    width: "50%",
  },
  input: {
    elevation: 1,
    backgroundColor: "#FFF",
    borderRadius: 10,
    height: 40,
    width: "100%",
    paddingLeft: 7,
  },
  button: {
    backgroundColor: "#2892fc",
    borderRadius: 20,
    height: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  buttonText: {
    color: "#FFF",
    fontFamily: "Montserrat_500Medium",
    fontSize: 15,
  },
});
