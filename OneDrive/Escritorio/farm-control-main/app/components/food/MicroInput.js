import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

const CerealInput = () => {
  return (
    <View style={styles.container}>
      <View style={styles.roundedContainer}>
        <View style={styles.micro}>
          <View style={[styles.inputMicroContainer, { zIndex: 1000 }]}>
            <Text style={[styles.inputText, { marginTop: 8 }]}>TIPO DE MICRO</Text>
          </View>
          <View style={styles.inputMicroContainer}>
            <Text style={[styles.inputText, { marginTop: 8 }]}>CANTIDAD DE KILOS</Text>
            <TextInput keyboardType="decimal-pad" style={styles.textInput} />
          </View>
        </View>
        <View style={[styles.inputContainer, { zIndex: 999 }]}>
          <Text style={styles.inputText}>UBICACIÓN</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>GUARDAR INGRESO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CerealInput;

const styles = StyleSheet.create({
  container: {
    height: "79.7%",
    width: "100%",
    backgroundColor: "#2892fc",
    padding: 11,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  roundedContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 7,
    height: "100%",
    justifyContent: "space-between",
  },
  inputMicroContainer: {
    width: "46%",
    backgroundColor: "#F8F8F8",
    gap: 10,
  },
  inputContainer: {
    height: "auto",
    gap: 10,
    width: "45%",
    marginVertical: "1%",
    backgroundColor: "#F8F8F8",
    marginLeft: 8,
  },
  micro: {
    marginTop: 10,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    height: "20%",
    zIndex: 1000,
    backgroundColor: "#F8F8F8",
    alignItems: 'center',
  },
  inputText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
    backgroundColor: "#F8F8F8",
  },
  buttonContainer: {
    height: "30%",
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
  textInput: {
    padding: 2,
    width: "100%",
    borderRadius: 5,
    paddingLeft: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "gray",
  },
});
