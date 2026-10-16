import React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const SignInInput = ({ icon, placeholder }) => {
  return (
    <TextInput
      mode="outlined"
      placeholder={placeholder}
      style={styles.input}
      left={
        <TextInput.Icon
          icon={() => <FontAwesome name={icon} size={20} color="#21D375" />}
        />
      }
    />
  );
};

export default SignInInput;

const styles = StyleSheet.create({
  input: {
    margin: 10,
    borderRadius: 5,
  },
});
