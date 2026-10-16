import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import useGlobal from "../../core/global";
import DropDownMenu from "../DropDownMenu";

const NewTaskModal = ({ visible, onClose }) => {
  const refreshAdminScreen = useGlobal((state) => state.refreshAdminScreen);
  const farms = useGlobal((state) => state.farms);
  const sendTask = useGlobal((state) => state.sendTask);
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
  const [items, setItems] = useState([]);
  const [farm, setFarm] = useState("");
  const [farmError, setFarmError] = useState("");

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const onAdd = () => {
    let error = false;
    const notFarm = !farm;
    if (notFarm) {
      setFarmError("Seleccione una granja");
      error = true;
    }
    const notTitle = !title;
    if (notTitle) {
      setTitleError("Ingrese un título");
      error = true;
    }
    const notDescription = !description;
    if (notDescription) {
      setDescriptionError("Ingrese una descripción");
      error = true;
    }
    if (error) {
      return;
    }
    sendTask(title, description, farm);
    setTitle("");
    setDescription("");
    setFarm("");
    refreshAdminScreen();
    onClose();
  };

  useEffect(() => {
    if (farms.length > 0) {
      setItems(formatFarms());
    }
  }, [farms]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <TouchableWithoutFeedback
        onPress={() => {
          onClose();
          setFarmError("");
          setTitleError("");
          setDescriptionError("");
        }}
      >
        <View style={styles.background}>
          <View style={styles.container}>
            <View style={styles.top}>
              <Text style={styles.title}>Crear nueva tarea</Text>
            </View>
            <View style={styles.bottom}>
              <View style={{ gap: 10 }}>
                <View style={styles.row}>
                  <Text
                    style={[styles.subtitle, { color: farmError ? "red" : "" }]}
                  >
                    {farmError ? farmError : "Granja"}
                  </Text>
                </View>
                <DropDownMenu
                  icon={true}
                  source={require("../../assets/icons/granero-verde.png")}
                  title={"Seleccionar"}
                  height={35}
                  data={items}
                  value={farm}
                  onChange={setFarm}
                  search={false}
                />
              </View>
              <View style={{ gap: 10 }}>
                <Text
                  style={[styles.subtitle, { color: titleError ? "red" : "" }]}
                >
                  {titleError ? titleError : "Título"}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { borderColor: titleError ? "#ff5555" : "white" },
                  ]}
                  value={title}
                  onChangeText={(text) => {
                    setTitle(text);
                    if (titleError) {
                      setTitleError("");
                    }
                  }}
                />
              </View>
              <View style={{ gap: 10 }}>
                <Text
                  style={[
                    styles.subtitle,
                    { color: descriptionError ? "red" : "" },
                  ]}
                >
                  {descriptionError ? descriptionError : "Descripción"}
                </Text>
                <TextInput
                  style={[
                    styles.textArea,
                    { borderColor: descriptionError ? "#ff5555" : "white" },
                  ]}
                  value={description}
                  onChangeText={(text) => {
                    setDescription(text);
                    if (descriptionError) {
                      setDescriptionError("");
                    }
                  }}
                  multiline={true}
                  textAlignVertical="top"
                />
              </View>
              <TouchableOpacity style={styles.button} onPress={() => onAdd()}>
                <Text style={styles.buttonText}>Enviar Tarea</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default NewTaskModal;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 350,
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
    padding: 10,
    gap: 10,
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
  textArea: {
    padding: 2,
    width: "100%",
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: "#FFF",
    elevation: 1,
    height: 100,
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
