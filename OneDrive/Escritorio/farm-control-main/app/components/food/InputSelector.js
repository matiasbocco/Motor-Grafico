import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";

const InputSelector = () => {

    const [selectedButton, setSelectedButton] = useState(1);

    const handlePress = (buttonId) => {
        setSelectedButton(buttonId); // Establecer el botón actualmente seleccionado
    };

    const isButtonSelected = (buttonId) => {
        return selectedButton === buttonId;
    };

    return ( 
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, isButtonSelected(1) && styles.selectedButton]}
                onPress={() => handlePress(1)}
            >
                <Text style={styles.buttonText}>INGRESO</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, isButtonSelected(2) && styles.selectedButton]}
                onPress={() => handlePress(2)}
            >
                <Text style={styles.buttonText}>PRODUCCIÓN</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, isButtonSelected(3) && styles.selectedButton]}
                onPress={() => handlePress(3)}
            >
                <Text style={styles.buttonText}>ENTREGA</Text>
            </TouchableOpacity>
        </View>
     );
}
 
export default InputSelector;

const styles = StyleSheet.create({
    container: {
        height: '10%',
        width: '100%',
        backgroundColor: 'blue',
        flexDirection: 'row',
    },
    button: {
        height: '100%',
        width: '32%',
        backgroundColor: 'green',
        borderWidth: 3,
        boderColor: 'black',
        marginHorizontal: '0.5%'
    },
    selectedButton: {
        backgroundColor: 'yellow'
    }
})