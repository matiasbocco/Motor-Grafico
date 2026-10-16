import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import HeaderButton from "../HeaderButton";
import { useNavigation } from "@react-navigation/native";
import useGlobal from "../../core/global";
import GroupTable from "./GroupTable";

const Shed = ({ shedId, onPress }) => {
  const data = useGlobal((state) => state.farmData);

  const [showGroup, setShowGroup] = useState(true);

  const uploadDates = [0, 4, 7, 14, 21, 28, 35, 42];

  const [currentGroup, setCurrentGroup] = useState();

  const [groupData, setGroupData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const getTableData = useGlobal((state) => state.getTableData);

  const [showInput, setShowInput] = useState(false);

  const [weight, setWeight] = useState("");
  const [weightError, setWeightError] = useState("");

  const [mortality, setMortality] = useState("");
  const [mortalityError, setMortalityError] = useState("");

  const sendWeekData = useGlobal((state) => state.sendWeekData);
  const setFarmerNotification = useGlobal(
    (state) => state.setFarmerNotification
  );

  const generateUniqueKey = (item, index) => `${item.nombre}-${index}`;

  const handleBackPress = (id) => {
    setShowGroup(!showGroup);
    setTableData([]);
    setCurrentGroup(id);
  };

  const handlePress = async (id) => {
    setShowGroup(!showGroup);
    setCurrentGroup(id);
    setGroupData(data.find((item) => item.group_id === id));
    const table = await getTableData(id);
    setTableData(table);
    const gData = data.find((item) => item.group_id === id);
    if (gData.updated === false) {
      setShowInput(true);
    } else {
      setShowInput(false);
    }
  };

  const newGroup = (shedId) => {
    navigation.navigate("ShedUpload", { shed: shedId });
  };

  const navigation = useNavigation();

  const onSubmit = async () => {
    let error = false;

    const notWeight = !weight;
    if (notWeight) {
      setWeightError("Ingrese un peso");
      error = true;
    }
    const failWeight = /[a-zA-Z]/.test(weight);
    if (failWeight) {
      setWeightError("El peso ingresado no es válido");
      error = true;
    }

    const notMortality = !mortality;
    if (notMortality) {
      setMortalityError("Ingrese una mortandad");
      error = true;
    }
    const failMortality = /[a-zA-Z]/.test(mortality);
    if (failMortality) {
      setMortalityError("La mortandad ingresada no es válida");
      error = true;
    }

    if (!error) {
      if (weight.includes(",")) {
        const update = await sendWeekData(weight.replace(",", "."), mortality, groupData.day_count, groupData.group_id);
        setTableData(update);
      } else {
        const update = await sendWeekData(weight, mortality, groupData.day_count, groupData.group_id);
        setTableData(update);
      }
      setFarmerNotification(groupData.day_count);
      setWeight("");
      setMortality("");
      setShowInput(false);
    }
  };

  useEffect(() => {}, [data]);

  return (
    <>
      {showGroup ? (
        <>
          <View style={styles.header}>
            <HeaderButton
              source={require("./flecha-izquierda.png")}
              onPress={onPress}
            />
            <Text style={styles.shedText}>GALPÓN {shedId}</Text>
          </View>
          <View style={styles.shedContainer}>
            {data.map(
              (item, index) =>
                item.shed === shedId &&
                item.quantity >= 0 && (
                  <TouchableOpacity
                    style={styles.shedButton}
                    key={generateUniqueKey(item, index)}
                    onPress={() => handlePress(item.group_id)}
                  >
                    <Text style={styles.groupText}>GRUPO {item.group_id}</Text>
                    <Text style={styles.groupText}>EDAD: {item.day_count}</Text>
                    <Text style={styles.groupText}>
                      CANTIDAD INICIAL: {item.quantity}
                    </Text>
                  </TouchableOpacity>
                )
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.newGroupButton}
              onPress={() => newGroup(shedId)}
            >
              <Text style={styles.buttonText}>Nuevo Ingreso De Pollos</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.header}>
            <HeaderButton
              source={require("./flecha-izquierda.png")}
              onPress={() => handleBackPress(0)}
            />
            <Text style={styles.shedText}>GRUPO {groupData.group_id}</Text>
          </View>
          <ScrollView contentContainerStyle={styles.infoContainer}>
            <View style={styles.info}>
              <View style={styles.line}>
                <Image
                  source={require("../../assets/icons/sol-azul.png")}
                  style={styles.image}
                />
                <Text style={styles.infoText}>Día: {groupData.day_count}</Text>
              </View>
              <View style={styles.line}>
                <Image
                  source={require("../../assets/icons/pollo-azul.png")}
                  style={styles.image}
                />
                <Text style={styles.infoText}>
                  Cantidad Inicial: {groupData.quantity}
                </Text>
              </View>
              <View style={styles.line}>
                <Image
                  source={require("../../assets/icons/cabana-azul.png")}
                  style={styles.image}
                />
                <Text style={styles.infoText}>Cabaña: {groupData.cabin}</Text>
              </View>
              <View style={styles.line}>
                <Image
                  source={require("../../assets/icons/adn-azul.png")}
                  style={styles.image}
                />
                <Text style={styles.infoText}>
                  Linea: {groupData.genetic_line}
                </Text>
              </View>
              <View style={styles.line}>
                <Image
                  source={require("../../assets/icons/sexo-azul.png")}
                  style={styles.image}
                />
                <Text style={styles.infoText}>Sexo: {groupData.sex}</Text>
              </View>
              <View style={styles.table}>
                <GroupTable
                  day_0_mortality={tableData.day_0_mortality}
                  day_4_mortality={tableData.day_4_mortality}
                  day_7_mortality={tableData.day_7_mortality}
                  day_14_mortality={tableData.day_14_mortality}
                  day_21_mortality={tableData.day_21_mortality}
                  day_28_mortality={tableData.day_28_mortality}
                  day_35_mortality={tableData.day_35_mortality}
                  day_42_mortality={tableData.day_42_mortality}
                  day_49_mortality={tableData.day_49_mortality}
                  day_0_weight={tableData.day_0_weight}
                  day_4_weight={tableData.day_4_weight}
                  day_7_weight={tableData.day_7_weight}
                  day_14_weight={tableData.day_14_weight}
                  day_21_weight={tableData.day_21_weight}
                  day_28_weight={tableData.day_28_weight}
                  day_35_weight={tableData.day_35_weight}
                  day_42_weight={tableData.day_42_weight}
                  day_49_weight={tableData.day_49_weight}
                />
              </View>
            </View>
            {showInput && (
              <View style={[styles.sendContainer, { zIndex: 1 }]}>
                <Text
                  style={[
                    styles.inputText,
                    { color: mortalityError ? "#ff5555" : "#000000" },
                  ]}
                >
                  {mortalityError ? mortalityError : "MORTANDAD SEMANAL"}
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      borderColor: mortalityError ? "#ff5555" : "transparent",
                    },
                  ]}
                  keyboardType="decimal-pad"
                  value={mortality}
                  onChangeText={(text) => {
                    setMortality(text);
                    if (mortalityError) {
                      setMortalityError("");
                    }
                  }}
                />
                <Text
                  style={[
                    styles.inputText,
                    { color: weightError ? "#ff5555" : "#000000" },
                  ]}
                >
                  {weightError ? weightError : "PESO"}
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { borderColor: weightError ? "#ff5555" : "transparent" },
                  ]}
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={(text) => {
                    setWeight(text);
                    if (weightError) {
                      setWeightError("");
                    }
                  }}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={onSubmit}
                >
                  <Text style={styles.buttonText}>Enviar Datos</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </>
      )}
    </>
  );
};

export default Shed;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  header: {
    width: "100%",
    height: "6%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shedText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 15,
    marginRight: 10,
  },
  shedContainer: {
    height: "73%",
    gap: 12,
  },
  shedButton: {
    height: "22%",
    backgroundColor: "#FFFFFF",
    elevation: 1,
    borderRadius: 8,
    padding: 10,
  },
  buttonContainer: {
    height: "17%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#2892fc",
    justifyContent: "center",
    alignItems: "center",
    height: 35,
    borderRadius: 25,
    marginTop: 7,
  },
  buttonText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 15,
  },
  infoContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  info: {
    gap: 8,
    marginTop: 10,
  },
  infoText: {
    fontSize: 12,
    fontFamily: "Montserrat_500Medium",
  },
  textInput: {
    padding: 2,
    width: "100%",
    borderRadius: 5,
    paddingLeft: 20,
    backgroundColor: "#FFF",
    height: 25,
    elevation: 0.3,
    borderWidth: 0.5,
  },
  inputText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 11,
    backgroundColor: "'rgba(0, 0, 0, 0)'",
  },
  groupText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 12,
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
  },
  sendContainer: {
    marginTop: 10,
    backgroundColor: "rgba(255, 255, 255, 0)",
    borderRadius: 10,
    zIndex: 1,
    gap: 10
  },
  table: {
    marginTop: 7,
    zIndex: 0,
  },
  newGroupButton: {
    width: "90%",
    backgroundColor: "#2892fc",
    justifyContent: "center",
    alignItems: "center",
    height: 35,
    borderRadius: 25,
  },
});
