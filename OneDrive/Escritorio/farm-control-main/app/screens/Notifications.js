import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import HeaderButton from "../components/HeaderButton";
import { useNavigation } from "@react-navigation/native";
import NotificationBox from "../components/NotificationBox";
import useGlobal from "../core/global";

const Notifications = () => {
  const navigation = useNavigation();
  const getNotifications = useGlobal((state) => state.getNotifications);
  const savedNotifications = useGlobal((state) => state.notifications);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const pendingNotifications = await getNotifications();
      setNotifications(
        savedNotifications.filter((notification) => !notification.done)
      );
    };
    fetchNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderButton
          onPress={() => navigation.goBack()}
          source={require("../assets/icons/flecha-izquierda.png")}
          margin={{ marginLeft: 7 }}
        />
      </View>
      <ScrollView style={styles.notications}>
        {notifications.map((notification, index) => (
          <NotificationBox
            key={index}
            title={notification.title}
            body={notification.body}
            date={notification.date_time}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    height: "4%",
    width: "100%",
    backgroundColor: "#2892fc",
    justifyContent: "center",
  },
  notications: {
    padding: 10,
  },
});