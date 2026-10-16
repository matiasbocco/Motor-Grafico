import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import useGlobal from "../../core/global";

const NewFarmModal = ({ visible, onClose }) => {
  const [farm, setFarm] = useState("");
  const [farmError, setFarmError] = useState("");
  const newFarm = useGlobal((state) => state.newFarm);
  const showModal = useGlobal((state) => state.showModal);
  const refreshAdminScreen = useGlobal((state) => state.refreshAdminScreen);

  const onAdd = () => {
    let error = false;
    const notFarm = !farm;
    if (notFarm) {
      setFarmError("Ingrese una cantidad");
      error = true;
    }
    if (error) {
      return;
    }
    newFarm(farm);
    onClose();
    showModal();
    refreshAdminScreen();
  };
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.background}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.top}>
                <Text style={styles.title}>Añadir Granja</Text>
              </View>
              <View style={styles.bottom}>
                <View style={{ gap: 10 }}>
                  <View style={styles.row}>
                    <Image
                      source={require("../../assets/icons/granero-verde.png")}
                      style={styles.image}
                    />
                    <Text style={styles.subtitle}>Granja</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={farm}
                    onChangeText={(text) => {
                      setFarm(text);
                      if (farmError) {
                        setFarmError("");
                      }
                    }}
                  />
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => onAdd()}
                  >
                    <Text style={styles.buttonText}>Crear Granja</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default NewFarmModal;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 350,
    height: 200,
    backgroundColor: "#F5F5F5",
    elevation: 1,
    borderRadius: 10,
  },
  top: {
    height: 50,
    backgroundColor: "#21D375",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 18,
  },
  bottom: {
    height: 150,
    padding: 10,
    gap: 10,
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  subtitle: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 16,
  },
  input: {
    padding: 2,
    width: "100%",
    borderRadius: 5,
    paddingLeft: 20,
    backgroundColor: "#FFF",
    elevation: 1,
  },
  button: {
    height: 33,
    backgroundColor: "#6cf5ad",
    elevation: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
  },
});
