import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";

const Announcement = ({ title, body, date, task, onPress }) => {
  const [finalDate, setFinalDate] = useState(null);

  useEffect(() => {
    if (date) {
      const [day, month] = date.split("-").map(Number);
      const taskDate = new Date(new Date().getFullYear(), month - 1, day); // El mes está basado en 0

      // Obtener la fecha actual
      const currentDate = new Date();

      // Calcular la diferencia en días
      const differenceInTime = currentDate - taskDate;
      const differenceInDays = Math.floor(
        differenceInTime / (1000 * 3600 * 24)
      );
      setFinalDate(differenceInDays);
    }
  }, []);

  return (
    <>
      {task ? (
        <TouchableOpacity style={styles.card} onPress={onPress}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          {date && (
            <View style={styles.footer}>
              <Text style={styles.dateText}>Hace {finalDate} días</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
        </View>
      )}
    </>
  );
};

export default Announcement;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: "100%",
    borderRadius: 10,
    padding: 10,
    elevation: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: "Montserrat_500Medium",
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
    color: "gray",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end", // Alinear a la derecha
    marginTop: "auto", // Empuja el footer al final del componente
  },
  dateText: {
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    color: "gray",
  },
});
