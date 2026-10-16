import { View, Text, StyleSheet, Alert, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import HeaderButton from "../components/HeaderButton";
import { useNavigation } from "@react-navigation/native";
import useGlobal from "../core/global";
import SlaughterCard from "../components/admin/SlaughterCard";

const BatchDetail = () => {
  const navigation = useNavigation();
  const batch = useGlobal((state) => state.batch);
  const deleteBatch = useGlobal((state) => state.deleteBatch);
  const finishBatch = useGlobal((state) => state.finishBatch);
  const getSlaughters = useGlobal((state) => state.getSlaughters);
  const refreshAdminScreen = useGlobal((state) => state.refreshAdminScreen);
  const farm = batch.farm;
  const showModal = useGlobal((state) => state.showModal);

  const [slaughters, setSlaughters] = useState([]);

  const onDelete = () => {
    Alert.alert(
      "Eliminar lote",
      "¿Estás seguro de que quieres eliminar el lote?\nEsta acción no se puede deshacer y se borrarán todos los datos asociados.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            deleteBatch(batch.farm);
            refreshAdminScreen();
            navigation.goBack();
            showModal();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onFinish = () => {
    Alert.alert(
      "Finalizar lote",
      "¿Estás seguro de que quieres dar por finalizado el lote?\nEsta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            finishBatch(batch.farm);
            refreshAdminScreen();
            navigation.goBack();
            showModal();
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const fetchSlaughters = async () => {
      const data = await getSlaughters(farm);
      if (data.length === 1 && data[0].hasOwnProperty("status")) {
        return;
      }
      setSlaughters(data);
    };
    fetchSlaughters();
  }, [getSlaughters]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <HeaderButton
          onPress={() => {
            navigation.goBack();
          }}
          source={require("../assets/icons/flecha-izquierda.png")}
          margin={{ marginLeft: 7 }}
        />
        <Text style={styles.title}>Granja {batch.farm}</Text>
        <HeaderButton
          onPress={() => {
            onDelete();
          }}
          source={require("../assets/icons/eliminar.png")}
          margin={{ marginRight: 7 }}
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.subtitle}>Detalles del lote</Text>
        <View style={styles.row}>
          <Image
            source={require("../assets/icons/calendario-verde.png")}
            style={styles.image}
          />
          <Text style={[styles.label, { fontWeight: "bold" }]}>
            Fecha de inicio:{" "}
          </Text>
          <Text style={styles.label}>{batch.date}</Text>
        </View>
        <View style={styles.row}>
          <Image
            source={require("../assets/icons/pollo-verde.png")}
            style={styles.image}
          />
          <Text style={[styles.label, { fontWeight: "bold" }]}>
            Pollos ingresados:{" "}
          </Text>
          <Text style={styles.label}>{batch.chiquens}</Text>
        </View>
        <View style={styles.row}>
          <Image
            source={require("../assets/icons/pollo-verde.png")}
            style={styles.image}
          />
          <Text style={[styles.label, { fontWeight: "bold" }]}>
            Pollos faenados:{" "}
          </Text>
          <Text style={styles.label}>{batch.slaughter_chiquens}</Text>
        </View>
        <View style={styles.row}>
          <Image
            source={require("../assets/icons/cantidad-verde.png")}
            style={styles.image}
          />
          <Text style={[styles.label, { fontWeight: "bold" }]}>
            KG producidos:{" "}
          </Text>
          <Text style={styles.label}>{batch.slaughter_chiquens_weight}kg</Text>
        </View>
        <View style={styles.row}>
          <Image
            source={require("../assets/icons/trigo-verde.png")}
            style={styles.image}
          />
          <Text style={[styles.label, { fontWeight: "bold" }]}>
            Alimento consumido:{" "}
          </Text>
          <Text style={styles.label}>{batch.food_quantity}kg</Text>
        </View>
        <View style={styles.row}>
          <Image
            source={require("../assets/icons/gas.png")}
            style={styles.image}
          />
          <Text style={[styles.label, { fontWeight: "bold" }]}>
            Gas consumido:{" "}
          </Text>
          <Text style={styles.label}>{batch.gas} L</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => onFinish()}>
          <Text style={styles.label}>Finalizar Lote</Text>
        </TouchableOpacity>
        <Text style={[styles.subtitle, { marginTop: 10 }]}>
          Carga de pollos para faena
        </Text>
        <ScrollView>
          {slaughters.length === 0 ? (
            <Text>No hay cargas de faena registradas por el momento.</Text>
          ) : (
            slaughters.map((slaughter, index) => (
              <SlaughterCard 
                key={index} 
                date_time={slaughter.date_time} 
                shed={slaughter.shed}
                quantity={slaughter.quantity}
                weight={slaughter.gross_weight}
                truck={slaughter.truck}
                trucker={slaughter.trucker}
              />
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default BatchDetail;

const styles = StyleSheet.create({
  header: {
    height: "6%",
    width: "100%",
    backgroundColor: "#21D375",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 16,
  },
  body: {
    flex: 1,
    padding: 10,
    gap: 10,
  },
  subtitle: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  label: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#21D375",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    width: "45%",
    alignSelf: "center",
    marginTop: 10,
  },
});
