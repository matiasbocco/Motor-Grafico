import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

const ShedButton = ({ onPress, id }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.shed}>GALPÓN {id}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShedButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F8',
    height: '12%',
  },
  button: {
    width: '100%',
    backgroundColor: '#2892fc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 12,
  },
  shed: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 16
  },
  day: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12 
  },
});
