import { View, Text, StyleSheet } from "react-native";
import React from "react";

const NotificationBox = ({ title, body, date }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
};

export default NotificationBox;

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: "#FFF",
    elevation: 1,
    borderRadius: 13,
    padding: 5,
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 14,
    marginTop: 5,
  },
  date: {
    color: "gray",
    fontSize: 10,
    position: 'absolute',
    bottom: 5,
    right: 10,
  },
});
