import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import Shed from "./Shed";
import ShedButton from "./ShedButton";
import useGlobal from "../../core/global";

const ShedSelector = () => {
  const [showButton, setShowButton] = useState(true);

  const [currentShed, setCurrentShed] = useState(0);

  const generateUniqueKey = (item, index) => `${item.nombre}-${index}`;

  const data = useGlobal((state) => state.farmData);

  let sheds_id = [];

  const handlePress = (id) => {
    setShowButton(!showButton);
    setCurrentShed(id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.roundedContainer}>
        {showButton ? (
          <>
            {data.map((item, index) => (
              !sheds_id.includes(item.shed) ? (
                sheds_id.push(item.shed),
                <ShedButton
                  key={item.shed}
                  id={item.shed}
                  onPress={() => handlePress(item.shed)}
                />
              ) : (
                <React.Fragment key={generateUniqueKey(item, index)}></React.Fragment>
              )
            ))}
          </>
        ) : (
          <>
            <Shed shedId={currentShed} onPress={() => handlePress(0)} />
          </>
        )}
      </View>
    </View>
  );
};

export default ShedSelector;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#2892fc",
    padding: 11,
    borderRadius: 10,
  },
  roundedContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 7,
    height: "100%",
    padding: 8,
    gap: 3,
  },
});
