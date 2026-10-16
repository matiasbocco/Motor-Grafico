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
  
  const NewShedModal = ({ visible, onClose, farm }) => {
    const [newArea, setNewArea] = useState("");
    const [newAreaError, setNewAreaError] = useState("");
    const [number, setNumber] = useState(0);
    const [numberError, setNumberError] = useState("");
    const refreshAdminScreen = useGlobal((state) => state.refreshAdminScreen);
    const editShedArea = useGlobal((state) => state.editShedArea);
    const newShed = useGlobal((state) => state.newShed);

    const handleClose = () => {
        setNewArea("");
        onClose();
    };
  
    const onAdd = () => {
      let error = false;
      const notNewArea = !newArea;
      if (notNewArea) {
        setNewAreaError("Ingrese un area");
        error = true;
      }
      const notNumber = !number;
      if (notNumber) {
        setNumberError("Ingrese un número");
        error = true;
      }
      if (error) {
        return;
      }
      
      newShed(number, farm, newArea);
      onClose();
      refreshAdminScreen();
    };
    return (
      <Modal
        transparent={true}
        visible={visible}
        onRequestClose={handleClose}
        animationType="fade"
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.background}>
            <TouchableWithoutFeedback>
              <View style={styles.container}>
                <View style={styles.top}>
                  <Text style={styles.title}>Agregar Galpón</Text>
                </View>
                <View style={styles.bottom}>
                <View style={{ gap: 10 }}>
                    <View style={styles.row}>
                      <Image
                        source={require("../../assets/icons/galpon-verde.png")}
                        style={styles.image}
                      />
                      <Text style={styles.subtitle}>Número</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      value={number}
                      onChangeText={(text) => {
                        setNumber(text);
                        if (numberError) {
                          setNumberError("");
                        }
                      }}
                    />
                  </View>
                  <View style={{ gap: 10 }}>
                    <View style={styles.row}>
                      <Image
                        source={require("../../assets/icons/area-verde.png")}
                        style={styles.image}
                      />
                      <Text style={styles.subtitle}>Área</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      value={newArea}
                      onChangeText={(text) => {
                        setNewArea(text);
                        if (newAreaError) {
                          setNewAreaError("");
                        }
                      }}
                    />
                  </View>
                  <View>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => onAdd()}
                    >
                      <Text style={styles.buttonText}>Confirmar</Text>
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
  
  export default NewShedModal;
  
  const styles = StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      width: 350,
      height: 260,
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
  