import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import HeaderButton from "../components/HeaderButton";
import { useNavigation } from "@react-navigation/native";
import useGlobal from "../core/global";
import ShedModal from "../components/admin/ShedModal";
import NewShedModal from "../components/admin/NewShedModal";
import TimedModal from "../components/TimedModal";

const FarmDetail = () => {
  const navigation = useNavigation();
  const farm = useGlobal((state) => state.currentFarm);
  const getFarmSheds = useGlobal((state) => state.getFarmSheds);
  const adminRefresh = useGlobal((state) => state.adminRefresh);
  const refreshAdminScreen = useGlobal((state) => state.refreshAdminScreen);
  const deleteShed = useGlobal((state) => state.deleteShed);
  const [sheds, setSheds] = useState([]);
  const flag = sheds.length > 0;
  const [visible, setVisible] = useState(false);
  const [shedVisible, setShedVisible] = useState(false);
  const [area, setArea] = useState(0);
  const [number, setNumber] = useState(0);

  const onDelete = (farm, number) => {
    Alert.alert(
      "Eliminar galpón",
      "¿Estás seguro de que quieres eliminar el galpón?\nEsta acción no se puede deshacer y se borrarán todos los datos asociados.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          onPress: () => {
            deleteShed(farm, number);
            refreshAdminScreen();
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFarmSheds(farm);
      setSheds(data);
    };
    fetchData();
  }, [adminRefresh]);

  return (
    <ScrollView style={{ flex: 1 }}>
      <ShedModal
        visible={visible}
        onClose={() => setVisible(false)}
        area={area}
        number={number}
        farm={farm}
      />
      <NewShedModal
        visible={shedVisible}
        onClose={() => setShedVisible(false)}
        farm={farm}
      />
      <View style={styles.header}>
        <HeaderButton
          onPress={() => navigation.goBack()}
          source={require("../assets/icons/flecha-izquierda.png")}
          margin={{ marginLeft: 7 }}
        />
        <Text style={styles.title}>Granja {farm}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.subtitle}>Galpones</Text>
          {flag ? (
            sheds.map((shed, index) => (
              <View style={styles.shed} key={index}>
                <Text style={styles.text}>Galpón {shed.number}</Text>
                <View
                  style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
                >
                  <Image
                    source={require("../assets/icons/area-verde.png")}
                    style={styles.image}
                  />
                  <Text>{shed.area}</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setArea(shed.area);
                      setNumber(shed.number);
                      setVisible(true);
                    }}
                  >
                    <Image
                      source={require("../assets/icons/editar.png")}
                      style={styles.image}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onDelete(farm, shed.number)}>
                    <Image
                      source={require("../assets/icons/eliminar.png")}
                      style={styles.image}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text>No hay galpones asignados para esta granja.</Text>
          )}
        </View>
        <View
          style={{
            elevation: 0.5,
            borderRadius: 20,
            backgroundColor: "#DCE5E5",
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShedVisible(true)}
          >
            <Image
              source={require("../assets/icons/mas.png")}
              style={styles.add}
            />
            <Text>Agregar galpón</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default FarmDetail;

const styles = StyleSheet.create({
  header: {
    height: "6%",
    width: "100%",
    backgroundColor: "#21D375",
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
  },
  title: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 16,
    marginLeft: "27%",
  },
  body: {
    flex: 1,
    padding: 10,
    gap: 10,
  },
  card: {
    backgroundColor: "#DCE5E5",
    padding: 10,
    borderRadius: 10,
    elevation: 1,
    minHeight: 100,
  },
  subtitle: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 20,
    marginBottom: 10,
  },
  shed: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 1,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 20,
    height: 20,
  },
  button: {
    backgroundColor: "#DCE5E5",
    height: 50,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    padding: 10,
    gap: 10,
  },
  add: {
    width: 20,
    height: 20,
  },
});
