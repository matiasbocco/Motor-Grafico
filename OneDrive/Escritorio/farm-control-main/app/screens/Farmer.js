import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderButton from "../components/HeaderButton";
import NotificationComponent from "../components/Notification";
import ShedSelector from "../components/farmer/ShedSelector";
import useGlobal from "../core/global";
import RunNotifications from "../components/Push";
import Income from "../components/farmer/Income";
import Announcement from "../components/farmer/Announcement";
import NotificationBell from "../components/NotificationBell";
import { useNavigation } from "@react-navigation/native";
import TimedModal from "../components/TimedModal";
import TaskModal from "../components/farmer/TaskModal";

const FarmerScreen = () => {
  const navigation = useNavigation();

  const [inputContent, setInputContent] = useState([
    { id: 1, content: <ShedSelector /> },
    { id: 2, content: <Income /> },
  ]);

  const getFarmerData = useGlobal((state) => state.getFarmerData);
  const user = useGlobal((state) => state.user);

  const sendGroup = useGlobal((state) => state.sendGroup);

  const [currentInput, setCurrentInput] = useState(1);

  const [selectedButton, setSelectedButton] = useState(1);

  const [pendingTasks, setPendingTasks] = useState(null);

  const [notificationCount, setNotificationCount] = useState(0);
  const savedNotifications = useGlobal((state) => state.notifications);
  const getNotifications = useGlobal((state) => state.getNotifications);
  const response = useGlobal((state) => state.response);
  const modalVisible = useGlobal((state) => state.modalVisible);
  const closeModal = useGlobal((state) => state.closeModal);
  const farmerGetTasks = useGlobal((state) => state.farmerGetTasks);

  const handleNotificationPress = () => {
    navigation.navigate("Notifications");
  };

  const generateUniqueKey = (item, index) => `${item.nombre}-${index}`;

  const handlePress = (buttonId) => {
    setSelectedButton(buttonId); // Establecer el botón actualmente seleccionado
    setCurrentInput(buttonId);
  };

  const isButtonSelected = (buttonId) => {
    return selectedButton === buttonId;
  };

  const refreshFarmScreen = useGlobal((state) => state.refreshFarmScreen);
  const farmRefresh = useGlobal((state) => state.farmRefresh);

  const onRefresh = async () => {
    setRefreshing(true);
    refreshFarmScreen();
    setRefreshing(false);
  };

  const [refreshing, setRefreshing] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const onTask = (task) => {
    setSelectedTask(task);
    setActiveModal(true);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await farmerGetTasks();
      setPendingTasks(tasks);
    };
    fetchTasks();
  }, [farmRefresh]);

  useEffect(() => {
    getFarmerData();
    const fetchNotifications = async () => {
      const pendingNotifications = await getNotifications();
      const count = pendingNotifications.filter(
        (notification) => !notification.done
      ).length;
      setNotificationCount(count);
    };
    fetchNotifications();
  }, []);

  const logout = useGlobal((state) => state.logout);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F5F5F5" }}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <TimedModal
        visible={modalVisible}
        onClose={() => closeModal()}
        duration={3000}
        description={response.message}
        title={response.title}
        status={response.status}
      />
      <TaskModal
        visible={activeModal}
        onClose={() => {
          setActiveModal(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />
      <View style={styles.header}>
        <HeaderButton
          onPress={() => console.log("")}
          source={require("../assets/icon.png")}
          margin={{ marginLeft: 7 }}
        />
        <Text style={{ fontFamily: "Montserrat_500Medium", marginLeft: "20%" }}>
          {user.name}
        </Text>
        <NotificationBell
          count={notificationCount}
          onPress={handleNotificationPress}
        />
        <HeaderButton
          onPress={() => logout()}
          source={require("../assets/icons/logout.png")}
          margin={{ marginRight: 7, marginLeft: 15 }}
        />
      </View>
      <View style={styles.news}>
        <RunNotifications />
        {pendingTasks ? (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollView}
          >
            {pendingTasks.map((task, index) => (
              <View
                key={generateUniqueKey(task, index)}
                style={styles.taskContainer}
              >
                <Announcement
                  title={task.title}
                  body={task.description}
                  date={task.date_time}
                  onPress={() => onTask(task)}
                  task={true}
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <Announcement
            title={"No hay tareas pendientes"}
            body={""}
            task={false}
          />
        )}
      </View>
      <View style={styles.space}>
        <View style={styles.inputSelector}>
          <TouchableOpacity
            style={[
              styles.button,
              isButtonSelected(1) && styles.selectedButton,
              styles.leftButton,
            ]}
            onPress={() => handlePress(1)}
          >
            <Text style={styles.buttonText}>GALPONES</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              isButtonSelected(2) && styles.selectedButton,
              styles.rightButton,
            ]}
            onPress={() => handlePress(2)}
          >
            <Text style={styles.buttonText}>INGRESO</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.productContainer}>
          {inputContent.map(
            (item, index) =>
              currentInput === item.id && (
                <View key={generateUniqueKey(item, index)}>{item.content}</View>
              )
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default FarmerScreen;

const styles = StyleSheet.create({
  header: {
    height: "10%",
    width: "100%",
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  space: {
    padding: 10,
    width: "100%",
    height: "100%",
    backgroundColor: "#F5F5F5",
  },
  news: {
    height: "20%",
    width: "100%",
    backgroundColor: "#F5F5F5",
    padding: 10,
  },
  horizontalScrollView: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskContainer: {
    marginRight: 10,
    width: 320,
  },
  inputSelector: {
    height: "8%",
    width: "100%",
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    height: "100%",
    width: "40%",
    backgroundColor: "#78b8f7",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#2892fc",
  },
  buttonText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 12.5,
  },
  leftButton: {
    borderTopLeftRadius: 23,
  },
  rightButton: {
    borderTopRightRadius: 23,
  },
  productContainer: {
    height: "61.5%",
    width: "100%",
    overFlow: "hidden",
    backgroundColor: "#2892fc",
    borderRadius: 10,
  },
});
