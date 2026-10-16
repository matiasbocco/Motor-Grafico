import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import HeaderButton from "../components/HeaderButton";
import { useNavigation } from "@react-navigation/native";
import useGlobal from "../core/global";
import SlaughterTable from "../components/admin/SlaughterTable";

const SlaughterLoad = () => {
  const navigation = useNavigation();
  const getLastSlaughters = useGlobal((state) => state.getLastSlaughters);
  const [slaughters, setSlaughters] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const slaughters = await getLastSlaughters();
      setSlaughters(slaughters);
    };
    fetchData();
  }, [getLastSlaughters]);

  const sortDates = (dates) => {
    dates.sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("/").map(Number);
      const [dayB, monthB, yearB] = b.split("/").map(Number);
    
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
    
      return dateB - dateA;
    });
    return dates;
  };


  useEffect(() => {
    let listedDates = [];
    slaughters.forEach((slaughter) => {
      if (!listedDates.includes(slaughter.date)) {
        listedDates.push(slaughter.date);
      }
    });
    listedDates = sortDates(listedDates);
    setDates(listedDates);
  }, [slaughters]);

  return (
    <ScrollView style={styles.background}>
      <View style={styles.header}>
        <HeaderButton
          onPress={() => navigation.goBack()}
          source={require("../assets/icons/flecha-izquierda.png")}
          margin={{ marginLeft: 7 }}
        />
      </View>
      <View style={styles.body}>
        {slaughters.length > 0 ? (
          <>
            {dates.map((date) => (
              <View style={styles.card} key={date}>
                <View style={styles.titleHeader}>
                  <Image source={require("../assets/icons/calendario-negro.png")} style={styles.image}/>
                  <Text>{date}</Text>
                </View>
                <SlaughterTable
                  data={slaughters.filter((slaughter) => slaughter.date === date)}
                />
              </View>
            ))}
          </>
        ) : (
          <Text>No hay cargas de faena</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default SlaughterLoad;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    height: 40,
    width: "100%",
    backgroundColor: "#21D375",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  body: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  titleHeader: {
    height: 35,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#6cf5ad",
    elevation: 2,
    alignItems: "center",
    paddingLeft: 10,
    flexDirection: "row",
    gap: 10,
  },
  image: {
    height: 20,
    width: 20,
  },
});
