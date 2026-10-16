import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import DropDownMenu from "../DropDownMenu";
import useGlobal from "../../core/global";
import TimedModal from "../TimedModal";

const Delivery = () => {
  const [food, setFood] = useState(null);
  const [foodItem, setFoodItem] = useState([
    { label: "Preiniciador", value: "preiniciador" },
    { label: "Iniciador", value: "iniciador" },
    { label: "Terminador", value: "terminador" },
    { label: "Última semana", value: "ultima semana" },
  ]);
  const [foodError, setFoodError] = useState("");
  const [user, setUser] = useState(null);
  const [userError, setUserError] = useState("");
  const [userItem, setUserItem] = useState([]);
  const [farm, setFarm] = useState(null);
  const [farmError, setFarmError] = useState("");
  const [farmItem, setFarmItem] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [remitNumber, setRemitNumber] = useState("");
  const [remitNumberError, setRemitNumberError] = useState("");

  const getFarms = useGlobal((state) => state.getFarms);
  const getFarmUsers = useGlobal((state) => state.getFarmUsers);
  const sendFoodDelivery = useGlobal((state) => state.sendFoodDelivery);
  const response = useGlobal((state) => state.response);
  const modalVisible = useGlobal((state) => state.modalVisible);
  const closeModal = useGlobal((state) => state.closeModal);

  const handlePress = () => {
    let error = false;
    let errorText = "";

    const notQuantity = !quantity;
    if (notQuantity) {
      setQuantityError("Ingrese una cantidad");
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

    const notRemitNumber = !remitNumber;
    if (notRemitNumber) {
      setRemitNumberError("Ingrese el numero de remito");
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
    const notFood = !food;
    if (notFood) {
      setFoodError("Ingrese el tipo de alimento");
      error = true;
      if (errorText !== "") {
        errorText += ", " + foodError + " ";
      } else {
        errorText += foodError + " ";
      }
    }

    if (error) {
      return;
    }
    sendFoodDelivery(farm, user, food, quantity, remitNumber);
    setFarmError("");
    setUserError("");
    setFoodError("");
    setQuantityError("");
    setRemitNumberError("");
  };

  useEffect(() => {
    const fetchFarms = async () => {
      const farms = await getFarms();
      setFarmItem(farms);
    };

    const fetchFarmUsers = async () => {
      const users = await getFarmUsers();
      setUserItem(users);
    };

    fetchFarms();
    fetchFarmUsers();
  }, [getFarms, getFarmUsers]);

  return (
    <View style={styles.container}>
      <View style={styles.roundedContainer}>
        <View style={styles.view}>
          <Text style={styles.inputText}>GRANJA</Text>
          <DropDownMenu
            icon={true}
            source={require("../../assets/icons/granero-azul.png")}
            title={"Granja"}
            height={45}
            data={farmItem}
            value={farm}
            onChange={setFarm}
          />
          <Text style={styles.inputText}>RECIBIDO POR</Text>
          <DropDownMenu
            icon={true}
            source={require("../../assets/icons/granjero-azul.png")}
            title={"Seleccionar granjero"}
            height={45}
            data={userItem}
            value={user}
            onChange={setUser}
          />
          <View style={styles.delivery}>
            <View
              style={[
                styles.deliveryInputContainer,
                { zIndex: 1001, paddingRight: 5 },
              ]}
            >
              <Text style={styles.inputText}>TIPO DE ALIMENTO</Text>
              <DropDownMenu
                icon={true}
                source={require("../../assets/icons/alimento-azul.png")}
                title={"Seleccionar"}
                height={35}
                data={foodItem}
                value={food}
                onChange={setFood}
              />
            </View>
            <View style={[styles.deliveryInputContainer, { paddingLeft: 5 }]}>
              <Text style={styles.inputText}>CANTIDAD</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="decimal-pad"
                vaule={quantity}
                onChangeText={(text) => {
                  setQuantity(text);
                  if (quantityError) {
                    setQuantityError("");
                  }
                }}
              />
            </View>
          </View>
          <Text style={styles.inputText}>NÚMERO DE REMITO</Text>
          <TextInput
            style={styles.textInput}
            value={remitNumber}
            onChangeText={(text) => {
              setRemitNumber(text);
              if (remitNumberError) {
                setRemitNumberError("");
              }
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handlePress()}>
            <Text style={styles.buttonText}>GUARDAR ENTREGA</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TimedModal
        visible={modalVisible}
        onClose={closeModal()}
        duration={3500}
        title={response.title}
        description={response.message}
        status={response.status}
      />
    </View>
  );
};

export default Delivery;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#2892fc",
    padding: 11,
    borderRadius: 10,
  },
  view: {
    padding: 10,
    gap: 10,
  },
  roundedContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 7,
    justifyContent: "space-between",
    height: "100%",
  },
  delivery: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    backgroundColor: "#F8F8F8",
    zIndex: 1001,
  },
  deliveryInputContainer: {
    height: "100%",
    width: "50%",
    gap: 10,
  },
  inputContainer: {
    width: "95%",
    height: "23%",
    gap: 10,
  },
  textInput: {
    padding: 2,
    width: "100%",
    borderRadius: 5,
    paddingLeft: 14,
    backgroundColor: "#FFF",
    elevation: 1,
  },
  inputText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 11,
    backgroundColor: "#F8F8F8",
  },
  buttonContainer: {
    height: "25.5%",
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#2892fc",
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
    height: "35%",
    borderRadius: 25,
  },
  buttonText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 13,
  },
});
