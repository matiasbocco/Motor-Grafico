import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import useGlobal from "../core/global";
import { useNavigation } from "@react-navigation/native";
import HeaderButton from "../components/HeaderButton";
import TimedModal from "../components/TimedModal";
import PlusButton from "../components/admin/PlusButton";
import BatchCard from "../components/admin/BatchCard";
import NewBatchModal from "../components/admin/NewBatchModal";

const BatchAdmin = () => {
  const navigation = useNavigation();
  const response = useGlobal((state) => state.response);
  const title = response.title;
  const description = response.message;
  const status = response.status;
  const modalVisible = useGlobal((state) => state.modalVisible);
  const closeModal = useGlobal((state) => state.closeModal);
  const startBatch = useGlobal((state) => state.startBatch);
  const batches = useGlobal((state) => state.batches);
  const batchModal = useGlobal((state) => state.batchModal);
  const setBatchModal = useGlobal((state) => state.setBatchModal);
  const getActiveBatches = useGlobal((state) => state.getActiveBatches);
  const adminRefresh = useGlobal((state) => state.adminRefresh);
  const setBatch = useGlobal((state) => state.setBatch);
  const clearBatch = useGlobal((state) => state.clearBatch);

  const onAdd = () => {};

  const dayCount = (date) => {
    const formatedDate = new Date(date.split('-').reverse().join('-'));
    const today = new Date();
    const difference = today - formatedDate;
    return Math.floor(difference / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    getActiveBatches();
  }, [adminRefresh]);

  return (
    <View style={{ flex: 1 }}>
      <PlusButton onPress={() => setBatchModal(true)} />
      <TimedModal
        visible={modalVisible}
        onClose={() => closeModal()}
        duration={3000}
        description={description}
        title={title}
        status={status}
      />
      <NewBatchModal visible={batchModal} onClose={() => setBatchModal(false)}/>
      <View style={styles.header}>
        <HeaderButton
          onPress={() => navigation.goBack()}
          source={require("../assets/icons/flecha-izquierda.png")}
          margin={{ marginLeft: 7 }}
        />
        <Text style={styles.title}>Lotes</Text>
      </View>
      <View style={styles.body}>
        {batches.map((batch, index) => (
          <BatchCard
            key={index}
            farm={batch.farm}
            day={dayCount(batch.date)}
            date={batch.date}
            onPress={() => {
              clearBatch();
              setBatch(batch);
              navigation.navigate("BatchDetail");
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default BatchAdmin;

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
    marginLeft: "37%",
  },
  body: {
    height: "94%",
    padding: 10,
  },
});
