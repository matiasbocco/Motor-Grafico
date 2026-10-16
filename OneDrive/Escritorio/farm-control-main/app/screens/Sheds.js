import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import HeaderButton from "../components/HeaderButton";
import { useNavigation } from "@react-navigation/native";
import FarmButton from "../components/admin/FarmButton";
import PlusButton from "../components/admin/PlusButton";
import NewFarmModal from "../components/admin/NewFarmModal";
import TimedModal from "../components/TimedModal";
import useGlobal from "../core/global";

const Sheds = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const response = useGlobal((state) => state.response);
  const title = response.title;
  const description = response.message;
  const status = response.status;
  const modalVisible = useGlobal((state) => state.modalVisible);
  const closeModal = useGlobal((state) => state.closeModal);
  const adminRefresh = useGlobal((state) => state.adminRefresh);
  const farms = useGlobal((state) => state.farms);
  const getAdminFarms = useGlobal((state) => state.getAdminFarms);
  const setCurrentFarm = useGlobal((state) => state.setCurrentFarm);

  useEffect(() => {
    getAdminFarms();
  }, [adminRefresh]);

  return (
    <View style={{ flex: 1 }}>
      <TimedModal
        visible={modalVisible}
        onClose={() => closeModal()}
        duration={3000}
        description={description}
        title={title}
        status={status}
      />
      <PlusButton onPress={() => setVisible(true)} />
      <NewFarmModal visible={visible} onClose={() => setVisible(false)} />
      <View style={styles.header}>
        <HeaderButton
          onPress={() => navigation.goBack()}
          source={require("../assets/icons/flecha-izquierda.png")}
          margin={{ marginLeft: 7 }}
        />
        <Text style={styles.title}>Granjas</Text>
      </View>
      <View style={styles.body}>
        {farms.map((farm, index) => (
          <FarmButton 
            key={index}
            farm={farm.name} 
            sheds={farm.sheds} 
            onPress={() => {navigation.navigate("FarmDetail"); setCurrentFarm(farm.name)}}
        />
        ))}
      </View>
    </View>
  );
};

export default Sheds;

const styles = StyleSheet.create({
  header: {
    height: "6%",
    width: "100%",
    backgroundColor: "#21D375",
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
  },
  body: {
    height: "94%",
    padding: 10,
  },
  title: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 16,
    marginLeft: "35%",
  },
});
