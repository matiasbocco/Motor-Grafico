import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import HeaderButton from "../components/HeaderButton";
import { useNavigation } from "@react-navigation/native";
import DropDownMenu from "../components/DropDownMenu";
import useGlobal from "../core/global";
import TimedModal from "../components/TimedModal";

const SignUp = () => {
  const navigation = useNavigation();
  const [rank, setRank] = useState(null);
  const [rankError, setRankError] = useState("");
  const [items, setItems] = useState([
    { label: "Granjero", value: 1 },
    { label: "Camionero", value: 2 },
    { label: "Productor", value: 3 },
  ]);

  const [trucker, setTrucker] = useState(null);
  const [truckerError, setTruckerError] = useState("");
  const [truckerItems, setTruckerItems] = useState([
    { label: "Alimento", value: 2 },
    { label: "Faena", value: 4 },
    { label: "Reemplazo", value: 5 },
  ]);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [farmItems, setFarmItems] = useState([]);
  const [farm, setFarm] = useState("");
  const [farmError, setFarmError] = useState("");

  const signup = useGlobal((state) => state.signup);

  const modalVisible = useGlobal((state) => state.modalVisible);
  const showModal = useGlobal((state) => state.showModal);
  const closeModal = useGlobal((state) => state.closeModal);
  const response = useGlobal((state) => state.response);
  const farms = useGlobal((state) => state.farms);

  const formatFarms = () => {
    let data = [];
    farms.map((item) => {
      data.push({
        label:
          item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase(),
        value: item.name,
      });
    });
    return data;
  };

  const onSubmit = () => {
    let error = false;
    if (password !== repeatPassword) {
      setRepeatPasswordError("Las contraseñas no coinciden");
      error = true;
    }
    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      error = true;
    }
    if (/\s/.test(password)) {
      setPasswordError("La contraseña no puede contener espacios en blanco");
      error = true;
    }
    if (!/\d/.test(password)) {
      setPasswordError("La contraseña debe contener al menos un número");
      error = true;
    }
    if (!/[a-zA-Z]/.test(password)) {
      setPasswordError("La contraseña debe contener al menos una letra");
      error = true;
    }
    if (/\d/.test(name)) {
      setNameError("El nombre no puede contener números");
      error = true;
    }
    if (name === "") {
      setNameError("Ingrese el nombre");
      error = true;
    }
    if (/\d/.test(lastName)) {
      setNameError("El apellido no puede contener números");
      error = true;
    }
    if (lastName === "") {
      setNameError("Ingrese el apellido");
      error = true;
    }
    if (/\s/.test(username)) {
      setUsernameError(
        "El nombre de usuario no puede contener espacios en blanco"
      );
      error = true;
    }
    if (username.length < 6) {
      setUsernameError("El nombre de usuario debe tener al menos 6 caracteres");
      error = true;
    }
    if (username === "") {
      setUsernameError("Ingrese el nombre de usuario");
      error = true;
    }
    if (password === "") {
      setPasswordError("Ingrese la contraseña");
      error = true;
    }
    if (repeatPassword === "") {
      setRepeatPasswordError("Repita la contraseña");
      error = true;
    }
    if (rank === null) {
      setValueError("Seleccione el puesto");
      error = true;
    }
    if (rank === 1 && farm === "") {
      setFarmError("Ingrese la granja");
      error = true;
    }
    if (rank === 2 && trucker === null) {
      setTruckerError("Seleccione el rol del camionero");
      error = true;
    }

    if (error) {
      return;
    }

    if (rank === 1 || rank === 3) {
      signup(username, password, name, lastName, rank, farm);
    } else if (rank === 2) {
      signup(username, password, name, lastName, trucker, farm);
    }
    setName("");
    setLastName("");
    setUsername("");
    setPassword("");
    setRepeatPassword("");
    setRank(null);
    setFarm("");
    setTrucker(null);
    showModal();
  };

  useEffect(() => {
    if (farms.length > 0) {
      setFarmItems(formatFarms());
    }
  }, [farms]);

  return (
    <View style={styles.background}>
      <HeaderButton
        onPress={() => navigation.goBack()}
        source={require("../assets/icons/flecha-izquierda.png")}
      />
      <Text style={[styles.text, { color: nameError ? "red" : "black" }]}>
        {nameError ? nameError : "Nombre:"}
      </Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (nameError) {
            setNameError("");
          }
        }}
      />
      <Text style={[styles.text, { color: lastNameError ? "red" : "black" }]}>
        {lastNameError ? lastNameError : "Apellido:"}
      </Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={(text) => {
          setLastName(text);
          if (lastNameError) {
            setLastNameError("");
          }
        }}
      />
      <Text style={[styles.text, { color: usernameError ? "red" : "black" }]}>
        {usernameError ? usernameError : "Nombre de usuario:"}
      </Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          if (usernameError) {
            setUsernameError("");
          }
        }}
      />
      <Text style={[styles.text, { color: passwordError ? "red" : "black" }]}>
        {passwordError ? passwordError : "Contraseña:"}
      </Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (passwordError) {
            setPasswordError("");
          }
        }}
      />
      <Text
        style={[styles.text, { color: repeatPasswordError ? "red" : "black" }]}
      >
        {repeatPasswordError ? repeatPasswordError : "Repetir contraseña:"}
      </Text>
      <TextInput
        style={styles.input}
        value={repeatPassword}
        onChangeText={(text) => {
          setRepeatPassword(text);
          if (repeatPasswordError) {
            setRepeatPasswordError("");
          }
        }}
      />
      <Text style={[styles.text, { color: rankError ? "red" : "black" }]}>
        {rankError ? rankError : "Puesto:"}
      </Text>
      <DropDownMenu
        icon={true}
        source={require("../assets/icons/usuario-verde.png")}
        title={"Seleccionar puesto"}
        height={45}
        data={items}
        value={rank}
        onChange={setRank}
      />
      {rank === 1 && (
        <View style={styles.farm}>
          <Text style={[styles.text, { color: farmError ? "red" : "black" }]}>
            {farmError ? farmError : "Granja:"}
          </Text>
          <DropDownMenu
            icon={true}
            source={require("../assets/icons/granero-verde.png")}
            title={"Seleccionar"}
            height={35}
            data={farmItems}
            value={farm}
            onChange={setFarm}
            search={false}
          />
        </View>
      )}
      {rank === 2 && (
        <View style={styles.farm}>
          <Text
            style={[styles.text, { color: truckerError ? "red" : "black" }]}
          >
            {truckerError ? truckerError : "Rol:"}
          </Text>
          <DropDownMenu
            icon={true}
            source={require("../assets/icons/camion-verde.png")}
            title={"Seleccionar puesto"}
            height={45}
            data={truckerItems}
            value={trucker}
            onChange={setTrucker}
          />
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={{ fontFamily: "Montserrat_500Medium", fontSize: 14 }}>
          Crear Usuario
        </Text>
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
  );
};

export default SignUp;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 10,
  },
  text: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    marginTop: 20,
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    elevation: 1,
    padding: 10,
    marginTop: 5,
  },
  dropdown: {
    height: 40,
    borderWidth: 0,
    elevation: 1,
    borderRadius: 5,
  },
  farm: {
    marginTop: 10,
  },
  button: {
    height: 40,
    borderRadius: 5,
    backgroundColor: "#21D375",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    elevation: 1,
  },
});
