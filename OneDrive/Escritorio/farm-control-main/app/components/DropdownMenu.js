import React, { useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const DropDownMenu = ({ icon, title, height, data, value, onChange, source, search }) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && { borderColor: "blue" },
          { height: height },
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search={search}
        maxHeight={230}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? title : "..."}
        searchPlaceholder="Buscar..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onChange(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() =>
          icon && <Image style={styles.icon} source={source} />
        }
      />
    </View>
  );
};

export default DropDownMenu;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
  },
  dropdown: {
    elevation: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "white",
  },
  icon: {
    marginRight: 5,
    height: 20,
    width: 20,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
