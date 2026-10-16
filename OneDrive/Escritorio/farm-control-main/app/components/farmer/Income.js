import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import DropDownMenu from "../DropDownMenu";
import useGlobal from "../../core/global";
import { useNavigation } from "@react-navigation/native";
import TimedModal from "../TimedModal";

const Income = () => {
  const navigation = useNavigation();
  const [selectedButton, setSelectedButton] = useState(1);
  const [food, setFood] = useState(null);
  const [foodError, setFoodError] = useState("");
  const [foodItems, setFoodItems] = useState([
    { label: "Preiniciador", value: "preiniciador" },
    { label: "Iniciador", value: "iniciador" },
    { label: "Terminador", value: "terminador" },
    { label: "Última semana", value: "ultima semana" },
  ]);
  const [quantity, setQuantity] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [remitNumber, setRemitNumber] = useState("");
  const [remitNumberError, setRemitNumberError] = useState("");
  const [gas, setGas] = useState("");
  const [gasError, setGasError] = useState("");
  const [foodQuantity, setFoodQuantity] = useState("");
  const [foodQuantityError, setFoodQuantityError] = useState("");

  const [deliveryData, setDeliveryData] = useState([]);
  const getDelivery = useGlobal((state) => state.getDelivery);
  const setRemitData = useGlobal((state) => state.setRemitData);

  const farmRefresh = useGlobal((state) => state.farmRefresh);
  const sendFoodReceipt = useGlobal((state) => state.sendFoodReceipt);
  const response = useGlobal((state) => state.response);
  const sendGas = useGlobal((state) => state.sendGas);
  const modalVisible = useGlobal((state) => state.modalVisible);
  const showModal = useGlobal((state) => state.showModal);
  const closeModal = useGlobal((state) => state.closeModal);
  const sendManualFood = useGlobal((state) => state.sendManualFood);

  const isButtonSelected = (buttonId) => {
    return selectedButton === buttonId;
  };

  const handlePress = (buttonId) => {
    setSelectedButton(buttonId);
  };

  const onRefresh = async () => {
    const deliveries = await getDelivery();
    setDeliveryData(deliveries);
    console.log(deliveries);
  };

  const onGasSubmit = () => {
    let error = false;
    const notGas = !gas;
    if (notGas) {
      setGasError("Ingrese una cantidad");
      error = true;
    }
    const failGas = /[a-zA-Z]/.test(gas);
    if (failGas) {
      setGasError("La cantidad ingresada no es válida");
      error = true;
    }

    if (error) {
      return;
    }

    sendGas(gas);
    setGas("");
    showModal();
  };

  const onManualSend = () => {
    let error = false;
    const notFood = !food;
    if (notFood) {
      setFoodError("Seleccione un tipo de alimento");
      error = true;
    }

    const notQuantity = !foodQuantity;
    if (notQuantity) {
      setFoodQuantityError("Ingrese una cantidad");
      error = true;
    }
    const failQuantity = /[a-zA-Z]/.test(foodQuantity);
    if (failQuantity) {
      setFoodQuantityError("La cantidad ingresada no es válida");
      error = true;
    }

    if (error) {
      return;
    }

    sendManualFood(food, foodQuantity);
    setFoodQuantity("");
    setFood("");
  };

  const handleSend = () => {
    let error = false;
    let errorText = "";

    const notFood = !food;
    if (notFood) {
      setFoodError("Seleccione un tipo de alimento");
      error = true;
      errorText += foodError + " ";
    }

    const notQuantity = !quantity;
    if (notQuantity) {
      setQuantityError("Ingrese una cantidad");
      error = true;
      if (errorText !== "") {
        errorText += ", " + quantityError + " ";
      } else {
        errorText += quantityError + " ";
      }
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

    const notRemitNumber = !remitNumber;
    if (notRemitNumber) {
      setRemitNumberError("Ingrese un número de remito");
      error = true;
      if (errorText !== "") {
        errorText += ", " + remitNumberError + " ";
      } else {
        errorText += remitNumberError + " ";
      }
    }
    const failRemitNumber = /[a-zA-Z]/.test(remitNumber);
    if (failRemitNumber) {
      setRemitNumberError("El número de remito ingresado no es válido");
      error = true;
      if (errorText !== "") {
        errorText += ", " + remitNumberError + " ";
      } else {
        errorText += remitNumberError + " ";
      }
    }

    if (error) {
      return;
    }

    sendFoodReceipt(food, quantity, remitNumber);
    setFoodError("");
    setQuantityError("");
    setRemitNumberError("");
  };

  const onPress = (remit_number) => {
    const delivery = deliveryData.find(
      (item) => item.remit_number === remit_number
    );
    setRemitData(delivery);
    navigation.navigate("RemitDetail");
  };

  useEffect(() => {
    const fetchDelivery = async () => {
      const deliveries = await getDelivery();
      setDeliveryData(deliveries);
    };
    fetchDelivery();
    console.log(deliveryData);
  }, [getDelivery]);

  useEffect(() => {
    onRefresh();
  }, [farmRefresh]);

  const deliveryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onPress(item.remit_number)}
    >
      <View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../../assets/icons/agenda-azul.png")}
            style={styles.image}
          />
          <Text style={styles.deliveryText}>{item.remit_number}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../../assets/icons/alimento-azul.png")}
            style={styles.image}
          />
          <Text style={styles.deliveryText}>{item.food_type}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../../assets/icons/camion-azul.png")}
            style={styles.image}
          />
          <Text style={styles.deliveryText}>{item.trucker}</Text>
        </View>
      </View>
      <Text style={styles.subtext}>{item.date_time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isButtonSelected(1) ? "#2892fc" : "#78b8f7" },
            ]}
            onPress={() => handlePress(1)}
          >
            <Text>Gas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isButtonSelected(2) ? "#2892fc" : "#78b8f7" },
            ]}
            onPress={() => handlePress(2)}
          >
            <Text>Alimento</Text>
          </TouchableOpacity>
        </View>
        {selectedButton === 1 ? (
          <View style={{ gap: 10 }}>
            <Text style={[styles.text, { color: gasError && "red" }]}>
              {gasError ? gasError : "Litros Cargados"}
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={gas}
              onChangeText={(text) => {
                setGas(text);
                if (gasError) {
                  setGasError("");
                }
              }}
            />
            <TouchableOpacity
              style={styles.submit}
              onPress={() => onGasSubmit()}
            >
              <Text>Guardar</Text>
            </TouchableOpacity>
            <TimedModal
              visible={modalVisible}
              onClose={closeModal}
              duration={3500}
              title={response.title}
              description={response.message}
              status={response.status}
            />
          </View>
        ) : (
          <View style={styles.foodContainer}>
            {deliveryData.length > 0 ? (
              <FlatList
                data={deliveryData}
                renderItem={deliveryItem}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <Text>
                No hay ingresos de alimento pendientes de confirmacion por ahora
              </Text>
            )}
          </View>
        )}
        {selectedButton === 2 && (
          <View style={styles.foodManual}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat_500Medium",
                color: foodError && "red",
              }}
            >
              {foodError ? foodError : "Tipo de alimento"}
            </Text>
            <DropDownMenu
              icon={true}
              source={require("../../assets/icons/alimento-azul.png")}
              title="Seleccione un alimento"
              height={35}
              data={foodItems}
              value={food}
              onChange={setFood}
              search={false}
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Montserrat_500Medium",
                color: foodQuantityError && "red",
              }}
            >
              {foodQuantityError ? foodQuantityError : "Cantidad (KG)"}
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={foodQuantity}
              onChangeText={(text) => {
                setFoodQuantity(text);
                if (foodQuantityError) {
                  setFoodQuantityError("");
                }
              }}
            />
            <TouchableOpacity
              style={styles.manualButton}
              onPress={() => {
                onManualSend();
              }}
            >
              <Text>Guardar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default Income;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#2892fc",
    height: "100%",
    padding: 10,
    borderRadius: 10,
  },
  container: {
    backgroundColor: "#F8F8F8",
    height: "100%",
    width: "100%",
    borderRadius: 10,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: "10%",
  },
  button: {
    backgroundColor: "#78b8f7",
    height: "100%",
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  input: {
    width: "100%",
    height: 35,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    elevation: 1,
    padding: 7,
  },
  foodContainer: {
    gap: 10,
    width: "100%",
    height: "43.5%",
    backgroundColor: "#FFFFFF",
    elevation: 2,
    borderRadius: 10,
    marginTop: 10,
    padding: 15,
  },
  text: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    marginTop: 20,
  },
  submit: {
    backgroundColor: "#2892fc",
    height: 40,
    borderRadius: 10,
    elevation: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  dropdown: {
    height: 40,
    borderWidth: 0,
    elevation: 1,
    borderRadius: 5,
  },
  item: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingTop: 10,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
    height: 100,
    justifyContent: "space-between",
    paddingBottom: 5,
  },
  deliveryText: {
    fontSize: 12,
    marginBottom: 3,
  },
  subtext: {
    fontSize: 9,
    color: "gray",
    textAlign: "right",
  },
  image: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  foodManual: {
    gap: 10,
    marginTop: 5,
    height: "43.5%",
  },
  manualButton: {
    backgroundColor: "#2892fc",
    height: 40,
    borderRadius: 10,
    elevation: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
  }
});
