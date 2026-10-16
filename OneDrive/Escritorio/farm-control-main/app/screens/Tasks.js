import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import HeaderButton from "../components/HeaderButton";
import { useNavigation } from "@react-navigation/native";
import useGlobal from "../core/global";
import NewTaskModal from "../components/admin/NewTaskModal";
import TaskCard from "../components/admin/TaskCard";

const Tasks = () => {
  const navigation = useNavigation();
  const adminRefresh = useGlobal((state) => state.adminRefresh);
  const getAllTasks = useGlobal((state) => state.getAllTasks);
  const [visible, setVisible] = useState(false);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const onClose = () => {
    setVisible(false);
  };

  const tasks = async () => {
    const data = await getAllTasks();
    if (data.length > 0) {
      let pending = [];
      let completed = [];
      data.map((item) => {
        if (item.status === "pending") {
          pending.push(item);
        } else {
          completed.push(item);
        }
      });
      setPendingTasks(pending);
      setCompletedTasks(completed);
      console.log("pending: ", pendingTasks);
      console.log("completed: ",completedTasks);
    }
  };

  useEffect(() => {
    tasks();
  }, [adminRefresh]);

  return (
    <View style={styles.background}>
      <NewTaskModal visible={visible} onClose={() => onClose()} />
      <View style={styles.header}>
        <HeaderButton
          onPress={() => navigation.goBack()}
          source={require("../assets/icons/flecha-izquierda.png")}
          margin={{ marginLeft: 7 }}
        />
        <TouchableOpacity style={styles.icon} onPress={() => setVisible(true)}>
          <Image
            source={require("../assets/icons/mas.png")}
            style={styles.image}
          />
          <Text>Nueva Tarea</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.title}>Tareas Pendientes</Text>
          <FlatList
            data={pendingTasks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TaskCard
                title={item.title}
                description={item.description}
                date={item.date_time}
                farm={item.farm}
              />
            )}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Tareas Realizadas</Text>
          <FlatList
            data={completedTasks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TaskCard
                title={item.title}
                description={item.description}
                date={item.date_time}
                farm={item.farm}
                done={true}
                responsible={item.responsible}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default Tasks;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    height: "5%",
    width: "100%",
    backgroundColor: "#21D375",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    height: 30,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
    flexDirection: "row",
    marginRight: 3,
  },
  image: {
    width: 15,
    height: 15,
  },
  body: {
    padding: 10,
    flex: 1,
    gap: 10,
  },
  card: {
    height: "49%",
    backgroundColor: "#6cf5ad",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    padding: 10,
  },
  title: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 16,
    textAlign: "center",
  },
});
