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

const DeliveryInput = () => {
  const getProducers = useGlobal((state) => state.getProducers);
  const getTruckers = useGlobal((state) => state.getTruckers);
  const sendFoodProduction = useGlobal((state) => state.sendFoodProduction);
  const modalVisible = useGlobal((state) => state.modalVisible);
  const showModal = useGlobal((state) => state.showModal);
  const closeModal = useGlobal((state) => state.closeModal);
  const response = useGlobal((state) => state.response);
  const wipeResponse = useGlobal((state) => state.wipeResponse);

  const [modal, setModal] = useState(false);

  const [food, setFood] = useState(null);
  const [foodItem, setFoodItem] = useState([
    { label: "Preiniciador", value: "preiniciador" },
    { label: "Iniciador", value: "iniciador" },
    { label: "Terminador", value: "terminador" },
    { label: "Última semana", value: "ultima semana" },
  ]);
  const [foodError, setFoodError] = useState("");

  const [quantity, setQuantity] = useState("");
  const [quantityError, setQuantityError] = useState("");

  const [producer, setProducer] = useState(null);
  const [producerError, setProducerError] = useState("");
  const [producerItem, setProducerItem] = useState([]);

  const [trucker, setTrucker] = useState(null);
  const [truckerError, setTruckerError] = useState("");
  const [truckerItem, setTruckerItem] = useState([]);

  const onSubmit = () => {
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

    const notTrucker = !trucker;
    if (notTrucker) {
      setTruckerError("Seleccione un camionero");
      error = true;
      if (errorText !== "") {
        errorText += ", " + truckerError + " ";
      } else {
        errorText += truckerError + " ";
      }
    }

    const notProducer = !producer;
    if (notProducer) {
      setProducerError("Seleccione un camionero");
      error = true;
      if (errorText !== "") {
        errorText += ", " + producerError + " ";
      } else {
        errorText += producerError + " ";
      }
    }

    if (error) {
      return;
    }

    sendFoodProduction(food, quantity, producer, trucker);
    setFood(null);
    setQuantity("");
    setProducer(null);
    setTrucker(null);
    setFoodError("");
    setQuantityError("");
    setProducerError("");
    setTruckerError("");
    showModal();
  };

  useEffect(() => {
    const fetchTruckers = async () => {
      const truckers = await getTruckers();
      setTruckerItem(truckers);
    };
    const fetchProducers = async () => {
      const producers = await getProducers();
      setProducerItem(producers);
    };

    fetchTruckers();
    fetchProducers();
  }, [getTruckers, getProducers]);

  return (
    <View style={styles.container}>
      <View style={styles.roundedContainer}>
        <View style={styles.delivery}>
          <View style={[styles.deliveryInputContainer, { zIndex: 1001 }]}>
            <Text
              style={[
                styles.inputText,
                { marginTop: 8, color: foodError ? "red" : "black" },
              ]}
            >
              {foodError ? foodError : "TIPO DE ALIMENTO"}
            </Text>
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
          <View style={styles.deliveryInputContainer}>
            <Text
              style={[
                styles.inputText,
                { marginTop: 8, color: quantityError ? "red" : "black" },
              ]}
            >
              {quantityError ? quantityError : "CANTIDAD (kg)"}
            </Text>
            <TextInput
              style={styles.textInput}
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
        </View>
        <View style={[styles.inputContainer, { marginTop: 35, zIndex: 1000 }]}>
          <Text
            style={[
              styles.inputText,
              { marginLeft: 8, color: producerError ? "red" : "black" },
            ]}
          >
            {producerError ? producerError : "PRODUCTOR"}
          </Text>
          <DropDownMenu
            icon={true}
            source={require("../../assets/icons/usuario-azul.png")}
            title={"Seleccionar fabricante"}
            height={45}
            data={producerItem}
            value={producer}
            onChange={setProducer}
            search={true}
          />
        </View>
        <View style={[styles.inputContainer, { zIndex: 999 }]}>
          <Text
            style={[
              styles.inputText,
              { marginLeft: 8, color: truckerError ? "red" : "black" },
            ]}
          >
            {truckerError ? truckerError : "RECIBIDO POR"}
          </Text>
          <DropDownMenu
            icon={true}
            source={require("../../assets/icons/camion-azul.png")}
            title={"Seleccionar camionero"}
            height={45}
            data={truckerItem}
            value={trucker}
            onChange={setTrucker}
            search={true}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text style={styles.buttonText}>GUARDAR ENTREGA</Text>
          </TouchableOpacity>
          <TimedModal
            visible={modalVisible}
            onClose={() => {
              closeModal();
              wipeResponse();
            }}
            duration={3500}
            description={response.message}
            title={response.title}
            status={response.status}
          />
        </View>
      </View>
    </View>
  );
};

export default DeliveryInput;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#2892fc",
    padding: 11,
    borderRadius: 10,
  },
  roundedContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 7,
    justifyContent: "space-between",
    height: "100%",
  },
  delivery: {
    marginTop: 10,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    backgroundColor: "#F8F8F8",
    height: "auto",
    zIndex: 1001,
  },
  deliveryInputContainer: {
    height: "100%",
    width: "46%",
    gap: 10,
  },
  inputContainer: {
    width: "95%",
    height: "23%",
    gap: 10,
    marginLeft: 8,
  },
  textInput: {
    padding: 2,
    width: "100%",
    borderRadius: 5,
    paddingLeft: 20,
    backgroundColor: "#FFF",
    elevation: 1,
  },
  inputText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
    backgroundColor: "#F8F8F8",
  },
  buttonContainer: {
    height: "25.5%",
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
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
