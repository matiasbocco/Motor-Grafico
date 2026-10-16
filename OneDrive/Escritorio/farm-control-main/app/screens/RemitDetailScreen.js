import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import useGlobal from "../core/global";
import HeaderButton from "../components/HeaderButton";
import DropDownMenu from "../components/DropDownMenu";

const RemitDetailScreen = () => {
  const navigation = useNavigation();
  const data = useGlobal((state) => state.remitData);
  const [quantity, setQuantity] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [user, setUser] = useState(null);
  const [userError, setUserError] = useState("");
  const [userItem, setUserItem] = useState([]);
  const [farm, setFarm] = useState(null);
  const [farmError, setFarmError] = useState("");
  const [farmItem, setFarmItem] = useState([]);
  const sendFoodRecall = useGlobal((state) => state.sendFoodRecall);
  const sendFoodDelivery = useGlobal((state) => state.sendFoodDelivery);
  const sendFoodReceipt = useGlobal((state) => state.sendFoodReceipt);
  const getFarms = useGlobal((state) => state.getFarms);
  const getFarmUsers = useGlobal((state) => state.getFarmUsers);
  const refreshTruckScreen = useGlobal((state) => state.refreshTruckScreen);
  const refreshFarmScreen = useGlobal((state) => state.refreshFarmScreen);
  const showModal = useGlobal((state) => state.showModal);

  const onRecallSubmit = () => {
    let error = false;
    let errorText = "";

    const notQuantity = !quantity;
    if (notQuantity) {
      setQuantityError("Ingrese la cantidad cargada");
      error = true;
      errorText += quantityError + " ";
    }
    const failQuantity = /[a-zA-Z]/.test(quantity);
    if (failQuantity) {
      setQuantityError("La cantidad ingresada no es válida");
      error = true;
      if (errorText !== "") {
        errorText += ", " + quantityError + " ";
      } else {
        errorText += quantityError + " ";
      }
    }

    if (error) {
      return;
    }
    Alert.alert(
      "Confirmar Retiro",
      "¿Estás seguro de que quieres hacer un retiro?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            sendFoodRecall(data.food_type, quantity, data.remit_number);
            navigation.navigate("Truck");
            refreshTruckScreen();
            showModal();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onDeliverySubmit = () => {
    let error = false;
    let errorText = "";

    const notFarm = !farm;
    if (notFarm) {
      setFarmError("Ingrese la granja");
      error = true;
      if (errorText !== "") {
        errorText += ", " + farmError + " ";
      } else {
        errorText += farmError + " ";
      }
    }
    const notUser = !user;
    if (notUser) {
      setUserError("Ingrese el granjero");
      error = true;
      if (errorText !== "") {
        errorText += ", " + userError + " ";
      } else {
        errorText += userError + " ";
      }
    }

    if (error) {
      return;
    }
    Alert.alert(
      "Confirmar Entrega",
      "¿Estás seguro de que quieres hacer una entrega?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            sendFoodDelivery(
              farm,
              user,
              data.food_type,
              data.quantity,
              data.remit_number
            );
            navigation.navigate("Truck");
            refreshTruckScreen();
            showModal();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onReceiptSubmit = () => {
    let error = false;
    let errorText = "";

    const notQuantity = !quantity;
    if (notQuantity) {
      setQuantityError("Ingrese la cantidad cargada");
      error = true;
      errorText += quantityError + " ";
    }
    const failQuantity = /[a-zA-Z]/.test(quantity);
    if (failQuantity) {
      setQuantityError("La cantidad ingresada no es válida");
      error = true;
      if (errorText !== "") {
        errorText += ", " + quantityError + " ";
      } else {
        errorText += quantityError + " ";
      }
    }

    if (error) {
      return;
    }

    Alert.alert(
      "Confirmar Ingreso",
      "¿Estás seguro de que quieres confirmar el ingreso de alimento?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            sendFoodReceipt(
              data.food_type,
              quantity,
              data.trucker,
              data.remit_number
            );
            navigation.navigate("Farmer");
            refreshFarmScreen();
            showModal();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const rejectProduction = useGlobal((state) => state.rejectProduction);

  const onReject = () => {
    let error = false;
    let errorText = "";
    const notReject = !reject;
    if (notReject) {
      setFarmError("Ingrese el motivo de rechazo");
      error = true;
      errorText += farmError;
    }
    if (error) {
      return;
    }
    Alert.alert(
      "Confirmar Rechazo",
      "¿Estás seguro de que rechazar el retiro?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            rejectProduction(data.remit_number, reject, data.producer);
            navigation.navigate("Truck");
            showModal();
          },
        },
      ],
      { cancelable: false }
    );
    setModalVisible(!modalVisible);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [reject, setReject] = useState("");
  const [rejectError, setRejectError] = useState("");

  useEffect(() => {
    const fetchFarms = async () => {
      const farms = await getFarms();
      setFarmItem(farms);
    };

    const fetchFarmUsers = async () => {
      const users = await getFarmUsers();
      setUserItem(users);
    };

    if (!data.producer) {
      fetchFarms();
      fetchFarmUsers();
    }
  }, [getFarms, getFarmUsers]);

  return (
    <View sytle={styles.container}>
      <View style={styles.header}>
        <HeaderButton
          source={require("../assets/icons/flecha-izquierda.png")}
          onPress={() => navigation.navigate("Truck")}
        />
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Motivo de rechazo</Text>
              <TextInput
                style={[styles.input, { backgroundColor: "#F5F5F5" }]}
                placeholder="Escribe aquí"
                value={reject}
                onChangeText={(text) => {
                  setReject(text);
                  if (rejectError) {
                    setRejectError("");
                  }
                }}
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => onReject()}
              >
                <Text>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View style={styles.body}>
        <Text style={styles.title}>
          {data.producer ? "RETIRO" : "ENTREGA"} DE ALIMENTO
        </Text>
        <View style={styles.data}>
          <Image
            source={require("../assets/icons/agenda-azul.png")}
            style={styles.image}
          />
          <Text style={styles.subtitle}>NÚMERO DE REMITO: </Text>
          <Text style={styles.text}>{data.remit_number}</Text>
        </View>
        {data.producer ? (
          <View style={styles.data}>
            <Image
              source={require("../assets/icons/usuario-azul.png")}
              style={styles.image}
            />
            <Text style={styles.subtitle}>PRODUCTOR: </Text>
            <Text style={styles.text}>{data.producer}</Text>
          </View>
        ) : (
          <>
            {data.trucker ? (
              <>
                <View style={styles.data}>
                  <Image
                    source={require("../assets/icons/camion-azul.png")}
                    style={styles.image}
                  />
                  <Text style={styles.subtitle}>CAMIONERO: </Text>
                  <Text style={styles.text}>{data.trucker}</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.data}>
                  <Image
                    source={require("../assets/icons/cantidad-azul.png")}
                    style={styles.image}
                  />
                  <Text style={styles.subtitle}>CANTIDAD: </Text>
                  <Text style={styles.text}>{data.quantity} kg</Text>
                </View>
              </>
            )}
          </>
        )}
        <View style={styles.data}>
          <Image
            source={require("../assets/icons/alimento-azul.png")}
            style={styles.image}
          />
          <Text style={styles.subtitle}>TIPO DE ALIMENTO: </Text>
          <Text style={styles.text}>{data.food_type}</Text>
        </View>
        {data.producer ? (
          <View style={styles.inputContainer}>
            <Text
              style={[
                styles.inputText,
                { color: quantityError ? "red" : "black" },
              ]}
            >
              {quantityError ? quantityError : "Cantidad Cargada (kg)"}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: quantityError ? "red" : "",
                  borderWidth: quantityError ? 1 : 0,
                },
              ]}
              keyboardType="decimal-pad"
              value={quantity}
              onChangeText={(text) => {
                setQuantity(text);
                if (quantityError) {
                  setQuantityError("");
                }
              }}
            />
          </View>
        ) : (
          <>
            {data.trucker ? (
              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.inputText,
                    { color: quantityError ? "red" : "black" },
                  ]}
                >
                  {quantityError ? quantityError : "Cantidad Recibida (kg)"}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: quantityError ? "red" : "",
                      borderWidth: quantityError ? 1 : 0,
                    },
                  ]}
                  keyboardType="decimal-pad"
                  value={quantity}
                  onChangeText={(text) => {
                    setQuantity(text);
                    if (quantityError) {
                      setQuantityError("");
                    }
                  }}
                />
              </View>
            ) : (
              <View style={styles.inputContainer}>
                <Text
                  style={[styles.inputText, { color: farmError ? "red" : "" }]}
                >
                  {farmError ? farmError : "GRANJA"}
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
                <Text
                  style={[styles.inputText, { color: userError ? "red" : "" }]}
                >
                  {userError ? userError : "RECIBIDO POR"}
                </Text>
                <DropDownMenu
                  icon={true}
                  source={require("../assets/icons/granjero-azul.png")}
                  title={"Seleccionar granjero"}
                  height={45}
                  data={userItem}
                  value={user}
                  onChange={setUser}
                />
              </View>
            )}
          </>
        )}
        <View
          style={{
            gap: data.producer ? 160 : 0,
            marginTop: data.producer ? 10 : 50,
          }}
        >
          {data.trucker ? (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                onReceiptSubmit();
              }}
            >
              <Text style={styles.buttonText}>CONFIRMAR INGRESO</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                data.producer ? onRecallSubmit() : onDeliverySubmit();
              }}
            >
              <Text style={styles.buttonText}>
                {data.producer ? "CONFIRMAR RETIRO" : "CONFIRMAR ENTREGA"}
              </Text>
            </TouchableOpacity>
          )}
          {data.producer ? (
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>RECHAZAR RETIRO</Text>
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </View>
    </View>
  );
};

export default RemitDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    width: "100%",
    height: "100%",
  },
  header: {
    height: "5%",
    width: "100%",
    backgroundColor: "#2892fc",
    justifyContent: "center",
  },
  body: {
    height: "87%",
    padding: 15,
    gap: 50,
  },
  data: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    fontFamily: "Montserrat_500Medium",
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "gray",
    fontFamily: "Montserrat_500Medium",
  },
  text: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    fontFamily: "Montserrat_500Medium",
  },
  inputContainer: {
    gap: 10,
  },
  input: {
    height: 40,
    width: "100%",
    borderRadius: 7,
    elevation: 1,
    backgroundColor: "white",
    paddingLeft: 10,
  },
  inputText: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
  },
  confirmButton: {
    backgroundColor: "#2892fc",
    height: 40,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  rejectButton: {
    backgroundColor: "red",
    height: 40,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    paddingLeft: 10,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#2892fc",
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
