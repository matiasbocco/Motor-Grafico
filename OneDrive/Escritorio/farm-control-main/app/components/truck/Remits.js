import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import useGlobal from "../../core/global";
import { useNavigation } from "@react-navigation/native";
import TimedModal from "../TimedModal";

const Remits = () => {
  const navigation = useNavigation();
  const getProduction = useGlobal((state) => state.getProduction);
  const getRecall = useGlobal((state) => state.getRecall);
  const truckRefresh = useGlobal((state) => state.truckRefresh);
  const setRemitData = useGlobal((state) => state.setRemitData);
  const modalVisible = useGlobal((state) => state.modalVisible);
  // const showModal = useGlobal((state) => state.showModal);
  const closeModal = useGlobal((state) => state.closeModal);
  const response = useGlobal((state) => state.response);

  const [productionData, setProductionData] = useState([]);
  const [recallData, setRecallData] = useState([]);

  const onRefresh = async () => {
    const productions = await getProduction();
    setProductionData(productions);
    const recalls = await getRecall();
    setRecallData(recalls);
  };

  const onPress = (remit_number) => {
    const production = productionData.find(
      (item) => item.remit_number === remit_number
    );
    if (production) {
      setRemitData(production);
    } else {
      const recall = recallData.find(
        (item) => item.remit_number === remit_number
      );
      setRemitData(recall);
    }
    navigation.navigate("RemitDetail");
  };

  useEffect(() => {
    const fetchProductions = async () => {
      const productions = await getProduction();
      setProductionData(productions);
    };
    const fetchRecalls = async () => {
      const recalls = await getRecall();
      setRecallData(recalls);
    };

    fetchProductions();
    fetchRecalls();
  }, [getProduction, getRecall]);

  useEffect(() => {
    onRefresh();
  }, [truckRefresh]);

  const productionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onPress(item.remit_number)}
    >
      <View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../../assets/icons/agenda-azul.png")}
            style={styles.image}
          />
          <Text style={styles.text}>{item.remit_number}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../../assets/icons/alimento-azul.png")}
            style={styles.image}
          />
          <Text style={styles.text}>{item.food_type}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../../assets/icons/usuario-azul.png")}
            style={styles.image}
          />
          <Text style={styles.text}>{item.producer}</Text>
        </View>
      </View>
      <Text style={styles.subtext}>{item.date_time}</Text>
    </TouchableOpacity>
  );

  const recallItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onPress(item.remit_number)}
    >
      <View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../../assets/icons/agenda-azul.png")}
            style={styles.image}
          />
          <Text style={styles.text}>{item.remit_number}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../../assets/icons/alimento-azul.png")}
            style={styles.image}
          />
          <Text style={styles.text}>{item.food_type}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../../assets/icons/cantidad-azul.png")}
            style={styles.image}
          />
          <Text style={styles.text}>{item.quantity} kg</Text>
        </View>
      </View>
      <Text style={styles.subtext}>{item.date_time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.flap}>
          <Text style={styles.title}>Retiros</Text>
        </View>
        <View style={styles.box}>
          <FlatList
            data={productionData}
            renderItem={productionItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.flap}>
          <Text style={styles.title}>Entregas</Text>
        </View>
        <View style={styles.box}>
          <FlatList
            data={recallData}
            renderItem={recallItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
      <TimedModal
        visible={modalVisible}
        onClose={() => {
          closeModal();
          console.log("close");
        }}
        duration={3500}
        title={response.title}
        description={response.message}
        status={response.status}
      />
    </View>
  );
};

export default Remits;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#2892fc",
    paddingHorizontal: 11,
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: "space-between",
  },
  card: {
    height: "47%",
  },
  box: {
    height: "86%",
    width: "100%",
    backgroundColor: "#F8F8F8",
    padding: 6,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    elevation: 2,
  },
  title: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 15,
  },
  item: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingTop: 10,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
    height: 100,
    justifyContent: "space-between",
    paddingBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 3,
  },
  subtext: {
    fontSize: 9,
    color: "gray",
    textAlign: "right",
  },
  image: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  flap: {
    padding: 5,
    backgroundColor: "#78b8f7",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: "30%",
    alignItems: "center",
    elevation: 2,
  },
});
