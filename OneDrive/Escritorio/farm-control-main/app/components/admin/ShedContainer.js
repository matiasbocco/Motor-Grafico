import { View, Text, StyleSheet } from "react-native";
import React from "react";
import GroupContainer from "./GroupContainer";

const ShedContainer = ({ data, number }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Galpón {number}</Text>
      {data.map((item, index) => (
        <GroupContainer
          key={index}
          number={item.group_id}
          day={item.day_count}
          area={item.area}
          genetic_line={item.genetic_line}
          date={item.initial_date}
          quantity={item.quantity}
          sex={item.sex}
          mortality={item.mortality}
          cabin={item.cabin}
          day_0_mortality={item.day_0_mortality}
          day_4_mortality={item.day_4_mortality}
          day_7_mortality={item.day_7_mortality}
          day_14_mortality={item.day_14_mortality}
          day_21_mortality={item.day_21_mortality}
          day_28_mortality={item.day_28_mortality}
          day_35_mortality={item.day_35_mortality}
          day_42_mortality={item.day_42_mortality}
          day_0_weight={item.day_0_weight}
          day_4_weight={item.day_4_weight}
          day_7_weight={item.day_7_weight}
          day_14_weight={item.day_14_weight}
          day_21_weight={item.day_21_weight}
          day_28_weight={item.day_28_weight}
          day_35_weight={item.day_35_weight}
          day_42_weight={item.day_42_weight}
        />
      ))}
    </View>
  );
};

export default ShedContainer;

const styles = StyleSheet.create({
  container: {
    width: "95%",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 1, 
    padding: 10,
    gap: 7,
    marginTop: 10,
  },
  title: {
    fontSize: 15,
    fontFamily: "Montserrat_500Medium",
  },
});
