import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import HeaderButton from "../components/HeaderButton";
import { useNavigation } from "@react-navigation/native";
import useGlobal from "../core/global";
import TitleWithLine from "../components/TitleWithLine";
import ButtonGroup from "../components/admin/ButtonGroup";
import DropDownMenu from "../components/DropDownMenu";
import { BarChart } from "react-native-gifted-charts";

const Statistics = () => {
  const navigation = useNavigation();
  const currentFarm = useGlobal((state) => state.currentFarm);
  const setCurrentFarm = useGlobal((state) => state.setCurrentFarm);
  const statistics = useGlobal((state) => state.statistics);
  const farms = useGlobal((state) => state.farms);
  const selectedGraph = useGlobal((state) => state.selectedGraph);
  const [farmData, setFarmData] = useState([]);
  const [stat, setStat] = useState("fep");
  const [lastFarmBatch, setLastFarmBatch] = useState(null);

  const [items, setItems] = useState([
    { label: "FEP", value: "fep" },
    { label: "Consumo por ave", value: "consumo_ave" },
    { label: "Mortandad", value: "mortandad" },
    { label: "Conversión", value: "conversion" },
    { label: "Edad promedio", value: "edad_promedio" },
    { label: "Peso promedio", value: "peso_promedio" },
    { label: "Peso-Conversión", value: "peso_conversion" },
    { label: "Crecimiento diario", value: "crecimiento_diario" },
    { label: "Aves por m\u00B2", value: "aves_area" },
    { label: "Kg por m\u00B2", value: "kg_area" },
  ]);

  const calculateFarmData = () => {
    let data = [];
    if (farms) {
      for (let i = 0; i < farms.length; i++) {
        let farmBatchs = statistics.filter(
          (farm) => farm.farm === farms[i].name.toLowerCase()
        );
        if (farmBatchs.length === 0) {
          continue;
        }
        let date;
        for (let i = 0; i < farmBatchs.length; i++) {
          let parts = farmBatchs[i].batch.split("-");
          let test = `${parts[2]}${parts[1]}${parts[0]}`;
          if (i == 0) {
            date = test;
          }
          if (date < test) {
            date = test;
          }
        }
        let y = date.slice(0, 4);
        let m = date.slice(4, 6);
        let d = date.slice(6, 8);

        // Formatear a dd-mm-yyyy
        let lastDate = `${d}-${m}-${y}`;
        lastBatch = farmBatchs.find((batch) => batch.batch === lastDate);
        data.push(lastBatch);
      }
      setFarmData(data);
    }
  };

  const batchData = statistics.filter(
    (farm) => farm.farm === currentFarm.toLowerCase()
  );

  const [graphData, setGraphData] = useState([]);

  const setData = () => {
    let data = [];
    let listedFarms = [];
    if (farms) {
      if (selectedGraph === "farms") {
        for (let i = 0; i < farmData.length; i++) {
          if (!listedFarms.includes(farmData[i].farm.toLowerCase())) {
            listedFarms.push(farmData[i].farm.toLowerCase());
          }
          data.push({
            value: farmData[i][stat],
            label: farmData[i].farm,
            frontColor: "#21D375",
          });
        }
        if (farms && farms.length > 0) {
          farms.map((item) => {
            if (!listedFarms.includes(item.name.toLowerCase())) {
              data.push({
                value: 0,
                label: item.name.toLowerCase(),
                frontColor: "#4F4F4F",
              });
            }
          });
        }
      } else {
        for (let i = 0; i < batchData.length; i++) {
          data.push({
            value: batchData[i][stat],
            label: batchData[i].batch,
            frontColor: "#21D375",
          });
        }
      }
      setGraphData(data);
    }
  };

  useEffect(() => {
    if (farms.length > 0) {
      setCurrentFarm(farms[0].name);
      calculateFarmData();
    }
  }, [farms]);

  useEffect(() => {
    if (farmData.length > 0 && farms.length > 0) {
      setData();
    }
  }, [farmData, stat, selectedGraph]);

  useEffect(() => {
    if (farmData.length > 0 && farms.length > 0) {
      setData();
    }
  }, [stat, selectedGraph]);

  useEffect(() => {
    if (farmData.length > 0) {
      let batch = farmData.find(
        (farm) => farm.farm === currentFarm.toLowerCase()
      );
      setLastFarmBatch(batch);
    }
  }, [currentFarm]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <HeaderButton
          onPress={() => navigation.goBack()}
          source={require("../assets/icons/flecha-izquierda.png")}
          margin={{ marginLeft: 7 }}
        />
        <Text style={{ fontFamily: "Montserrat_500Medium" }}>
          Granja{" "}
          {currentFarm
            ? currentFarm.charAt(0).toUpperCase() + currentFarm.slice(1)
            : ""}
        </Text>
        <HeaderButton
          onPress={() => navigation.openDrawer()}
          source={require("../assets/icons/menu.png")}
          margin={{ marginRight: 7 }}
        />
      </View>
      <View style={styles.body}>
        <View style={styles.row}>
          <TitleWithLine title="Gráficos" />
          <ButtonGroup />
        </View>
        <DropDownMenu
          icon={true}
          source={require("../assets/icons/dato.png")}
          title={"Seleccionar dato"}
          height={35}
          data={items}
          value={stat}
          onChange={setStat}
        />
        {graphData.length > 0 && (
          <View style={styles.card}>
            <BarChart
              data={graphData}
              height={200}
              minHeight={3}
              width={290}
              barBorderRadius={3}
              barWidth={18}
              yAxisThickness={0}
              xAxisThickness={0}
              yAxisTextStyle={{ 
                color: "#4F4F4F",
                fontSize: 12,
                fontFamily: "Montserrat_500Medium",
              }}
              isAnimated
              animationDuration={500}
              spacing={25}
              noOfSections={5}
              xAxisLabelTexts={graphData.map((item) => item.label)} // Etiquetas personalizadas
              xAxisLabelTextStyle={{
                fontSize: 12,
                fontFamily: "Montserrat_500Medium",
              }}
              xAxisTextNumberOfLines={2}
            />
          </View>
        )}
        <View style={styles.stats}>
          <Text style={styles.title}>Estadísticas del último lote</Text>
          {lastFarmBatch ? (
            <View style={{ gap: 7.5 }}>
              <Text style={styles.data}>
                FEP: {lastFarmBatch.fep.toFixed(2)}
              </Text>
              <Text style={styles.data}>
                Consumo por ave: {lastFarmBatch.consumo_ave.toFixed(2)}
              </Text>
              <Text style={styles.data}>
                Mortandad: {lastFarmBatch.mortandad.toFixed(2)}
              </Text>
              <Text style={styles.data}>
                Conversión: {lastFarmBatch.conversion.toFixed(2)}
              </Text>
              <Text style={styles.data}>
                Edad promedio: {lastFarmBatch.edad_promedio.toFixed(2)}
              </Text>
              <Text style={styles.data}>
                Peso promedio: {lastFarmBatch.peso_promedio.toFixed(2)}
              </Text>
              <Text style={styles.data}>
                Peso conversión: {lastFarmBatch.peso_conversion.toFixed(2)}
              </Text>
              <Text style={styles.data}>
                Crecimiento Diario:{" "}
                {lastFarmBatch.crecimiento_diario.toFixed(2)}
              </Text>
              <Text style={styles.data}>
                {"Aves por m\u00B2: "}
                {lastFarmBatch.aves_area.toFixed(2)}
              </Text>
              <Text style={styles.data}>
                {"Kg por m\u00B2: "}
                {lastFarmBatch.kg_area.toFixed(2)}
              </Text>
            </View>
          ) : (
            <Text style={styles.data}>
              Esta granja no cuenta con lotes finalizados por el momento.
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  header: {
    height: "6%",
    width: "100%",
    backgroundColor: "#21D375",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  body: {
    flex: 1,
    padding: 10,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  stats: {
    backgroundColor: "#4AE28E",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 17,
    alignSelf: "center",
    marginBottom: 10,
  },
  data: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 14,
    marginLeft: 10,
  },
});
