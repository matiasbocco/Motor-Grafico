import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import HeaderButton from "../components/HeaderButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import useGlobal from "../core/global";
import DropDownMenu from "../components/DropDownMenu";

const ShedUploadScreen = () => {
  const navigation = useNavigation();
  const showModal = useGlobal((state) => state.showModal);

  const user = useGlobal((state) => state.user);
  const sendGroup = useGlobal((state) => state.sendGroup);

  const route = useRoute();
  const shed = route.params?.shed;

  const [quantity, setQuantity] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [cabin, setCabin] = useState("");
  const [cabinError, setCabinError] = useState("");
  const [cabinItems, setCabinItems] = useState([
    { label: "Pontevedra", value: "pontevedra" },
    { label: "Extra", value: "extra" },
  ]);
  const [geneticLine, setGeneticLine] = useState("");
  const [geneticLineError, setGeneticLineError] = useState("");
  const [geneticLineItems, setGeneticLineItems] = useState([
    { label: "Arboracres", value: "arboracres" },
    { label: "Ross", value: "ross" },
    { label: "Cobs", value: "cobs" },
  ]);
  const [sex, setSex] = useState("");
  const [sexError, setSexError] = useState("");
  const [sexItems, setSexItems] = useState([
    { label: "Macho", value: "macho" },
    { label: "Hembra", value: "hembra" },
    { label: "Mixto", value: "mixto" },
  ]);

  const [response, setResponse] = useState(null);

  const onSendGroup = async () => {
    let error = false;

    const notQuantity = !quantity;
    if (notQuantity) {
      setQuantityError("Ingrese una cantidad");
      error = true;
    }
    const failQuantity = /[a-zA-Z]/.test(quantity);
    if (failQuantity) {
      setQuantityError("La cantidad ingresada no es válida");
      error = true;
    }

    const notCabin = !cabin;
    if (notCabin) {
      setCabinError("Ingrese una cabaña");
      error = true;
    }

    const notGeneticLine = !geneticLine;
    if (notGeneticLine) {
      setGeneticLineError("Ingrese una línea genética");
      error = true;
    }

    const notSex = !sex;
    if (notSex) {
      setSexError("Ingrese un sexo");
      error = true;
    }

    if (error) {
      return;
    }

    const response = await sendGroup(shed, quantity, cabin, geneticLine, sex);
    setQuantityError("");
    setCabinError("");
    setGeneticLineError("");
    setSexError("");
    navigation.navigate("Farmer");
    showModal();
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.header}>
        <HeaderButton
          source={require("../assets/icons/flecha-izquierda.png")}
          onPress={() => navigation.navigate("Farmer")}
        />
        <Text style={styles.shedText}>GALPÓN {shed}</Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.fieldContainer}>
          <Text
            style={[
              styles.inputText,
              { color: quantityError ? "#ff5555" : "#000000" },
            ]}
          >
            {quantityError ? quantityError : "CANTIDAD DE POLLOS"}
          </Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: quantityError ? "#ff5555" : "white" },
            ]}
            value={quantity}
            onChangeText={(text) => {
              setQuantity(text);
              if (quantityError) {
                setQuantityError("");
              }
            }}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text
            style={[
              styles.inputText,
              { color: sexError ? "#ff5555" : "#000000" },
            ]}
          >
            {sexError ? sexError : "SEXO"}
          </Text>
          <DropDownMenu
            icon={true}
            source={require("../assets/icons/sexo-azul.png")}
            title={"Seleccionar"}
            height={35}
            data={sexItems}
            value={sex}
            onChange={setSex}
            search={false}
          />
        </View>
      </View>
      <View style={[styles.inputContainer, { flexDirection: "column" }]}>
        <Text
          style={[
            styles.inputText,
            { color: cabinError ? "#ff5555" : "#000000" },
          ]}
        >
          {cabinError ? cabinError : "CABAÑA"}
        </Text>
        <DropDownMenu
          icon={true}
          source={require("../assets/icons/cabana-azul.png")}
          title={"Seleccionar"}
          height={45}
          data={cabinItems}
          value={cabin}
          onChange={setCabin}
          search={false}
        />
      </View>
      <View style={[styles.inputContainer, { flexDirection: "column" }]}>
        <Text
          style={[
            styles.inputText,
            { color: geneticLineError ? "#ff5555" : "#000000" },
          ]}
        >
          {geneticLineError ? geneticLineError : "LINEA"}
        </Text>
        <DropDownMenu
          icon={true}
          source={require("../assets/icons/adn-azul.png")}
          title={"Seleccionar"}
          height={45}
          data={geneticLineItems}
          value={geneticLine}
          onChange={setGeneticLine}
          search={false}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onSendGroup}>
          <Text style={styles.buttonText}>CREAR INGRESO DE POLLOS</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ShedUploadScreen;

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: "7%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shedText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 15,
    marginRight: 10,
  },
  inputContainer: {
    width: "100%",
    height: "20%",
    marginTop: 20,
    flexDirection: "row",
    padding: 10,
    gap: 10,
  },
  fieldContainer: {
    height: "100%",
    width: "48%",
    gap: 10,
  },
  input: {
    padding: 2,
    width: "100%",
    borderRadius: 5,
    paddingLeft: 20,
    backgroundColor: "#FFF",
    height: 35,
    elevation: 1,
  },
  inputText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
  },
  buttonContainer: {
    height: "17%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#2892fc",
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
    height: "42%",
    borderRadius: 25,
  },
  buttonText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 15,
  },
});