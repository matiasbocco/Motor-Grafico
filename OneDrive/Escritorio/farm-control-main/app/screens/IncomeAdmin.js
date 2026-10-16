import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import useGlobal from "../core/global";
import { useNavigation } from "@react-navigation/native";
import HeaderButton from "../components/HeaderButton";

const IncomeAdmin = () => {
  const navigation = useNavigation();
  const data = useGlobal((state) => state.income);
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <HeaderButton
          onPress={() => navigation.goBack()}
          source={require("../assets/icons/flecha-izquierda.png")}
          margin={{ marginLeft: 7 }}
        />
        <Text style={styles.title}>
          Ingreso N° {data.production.remit_number}
        </Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.subtitle}>Retiro de Fábrica</Text>
        <View style={styles.card}>
            <View style={styles.row}>
                <Image source={require("../assets/icons/calendario-verde.png")} style={styles.image}/>
                <Text style={styles.label}>Fecha y Hora: {data.recall_date}</Text>
            </View>
            <View style={styles.row}>
                <Image source={require("../assets/icons/productor-verde.png")} style={styles.image}/>
                <Text style={styles.label}>Fabricante: {data.producer}</Text>
            </View>
            <View style={styles.row}>
                <Image source={require("../assets/icons/camion-verde.png")} style={styles.image}/>
                <Text style={styles.label}>Camionero: {data.trucker}</Text>
            </View>
        </View>
        <Text style={styles.subtitle}>Entrega en Granja</Text>
        <View style={styles.card}>
            <View style={styles.row}>
                <Image source={require("../assets/icons/calendario-verde.png")} style={styles.image}/>
                <Text style={styles.label}>Fecha y Hora: {data.receipt_date}</Text>
            </View>
            <View style={styles.row}>
                <Image source={require("../assets/icons/granjero-verde.png")} style={styles.image}/>
                <Text style={styles.label}>Receptor: {data.farmer}</Text>
            </View>
            <View style={styles.row}>
                <Image source={require("../assets/icons/trigo-verde.png")} style={styles.image}/>
                <Text style={styles.label}>Tipo de Alimento: {data.receipt.food_type}</Text>
            </View>
            <View style={styles.row}>
                <Image source={require("../assets/icons/cantidad-verde.png")} style={styles.image}/>
                <Text style={styles.label}>Cantidad: {data.receipt.quantity}kg</Text>
            </View>
        </View>
      </View>
    </View>
  );
};

export default IncomeAdmin;

const styles = StyleSheet.create({
  header: {
    height: "6%",
    width: "100%",
    backgroundColor: "#21D375",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 16,
    marginLeft: 102,
  },
  body: {
    padding: 10,
    gap: 10,
  },
  subtitle: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 20,
  },
  card: {
    backgroundColor: "white",
    elevation: 2,
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 30,
    height: 30,
  },
  label: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 16,
    marginLeft: 10,
  },
});
