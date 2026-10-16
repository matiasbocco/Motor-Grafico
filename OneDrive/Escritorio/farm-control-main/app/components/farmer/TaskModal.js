import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import useGlobal from "../../core/global";

const TaskModal = ({ visible, onClose, task }) => {
  const refreshFarmScreen = useGlobal((state) => state.refreshFarmScreen);
  const setTaskDone = useGlobal((state) => state.setTaskDone);
  const onDone = () => {
    Alert.alert(
      "Marcar tarea completada",
      "¿Estás seguro de que quieres marcar esta tarea como completada? Una vez completada, no podrás deshacer esta acción.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            setTaskDone(task.id);
            refreshFarmScreen();
            onClose();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      {task && (
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.background}>
            <View style={styles.container}>
              <View style={styles.top}>
                <Text style={styles.title}>{task.title}</Text>
              </View>
              <View style={styles.bottom}>
                <Text style={styles.bodyText}>{task.description}</Text>
                <View style={styles.row}>
                  <Image
                    style={styles.image}
                    source={require("../../assets/icons/usuario-azul.png")}
                  />
                  <Text style={styles.bodyText}>Asignada por: {task.assigner}</Text>
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => onDone()}
                >
                  <Text style={styles.buttonText}>Marcar tarea completada</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Modal>
  );
};

export default TaskModal;

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
    height: 45,
    backgroundColor: "#2892fc",
    justifyContent: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },
  title: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 18,
  },
  bottom: {
    padding: 10,
    gap: 10,
  },
  bodyText: {
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
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
  button: {
    height: 33,
    backgroundColor: "#78b8f7",
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
