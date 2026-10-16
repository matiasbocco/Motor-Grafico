import React, {useState} from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import CerealInput from "./CerealInput";
import MicroInput from './MicroInput'

const EntryInput = () => {

    const [inputContent, setInputContent] = useState([
        { id: 1, content: <CerealInput/> },
        { id: 2, content: <MicroInput/> },
    ]);
    
    const [currentInput, setCurrentInput] = useState(1);
    
    const [selectedButton, setSelectedButton] = useState(1);
    
    const generateUniqueKey = (item, index) => `${item.nombre}-${index}`;
    
    const handlePress = (buttonId) => {
        setSelectedButton(buttonId); // Establecer el botón actualmente seleccionado
        setCurrentInput(buttonId)
    };
    
    const isButtonSelected = (buttonId) => {
        return selectedButton === buttonId;
    };


    return ( 
       <View>
        <Text>      Opción no disponible momentaneamente</Text>
       {/* <View style={styles.productSelector}>
            <TouchableOpacity 
                style={[styles.productButton, isButtonSelected(1) && styles.selectedButton]}
                onPress={() => handlePress(1)}
            >
                <Text style={styles.buttonText}>CEREALES</Text>
                {isButtonSelected(1) && <View style={styles.underline} />}
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.productButton, isButtonSelected(2) && styles.selectedButton]}
                onPress={() => handlePress(2)}
            >
                <Text style={styles.buttonText}>MICRO</Text>
                {isButtonSelected(2) && <View style={styles.underline} />}
            </TouchableOpacity>
        </View>
        <View style={styles.productContainer}>
            {inputContent.map((item, index) => (
                    currentInput === item.id && (
                    <View key={generateUniqueKey(item, index)} style={styles.container}>
                        {item.content}
                    </View>
                )
                ))}
        </View> */}
        </View>
     );
}
 
export default EntryInput;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F8F8',
    },
    productSelector: {
        height: '7%', 
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: '5%',
        backgroundColor: '#2892fc',
    },
    productButton: {
        height: '75%',
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2892fc',
        marginHorizontal: '5%',
        marginTop: 5
    },
    productContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: '#F8F8F8',
    },
    underline: {
        height: 4, // Altura de la línea
        width: '100%', // Ancho de la línea, ajusta según necesites
        borderRadius: 10, // Radio de los bordes redondeados
        backgroundColor: '#000', // Color de la línea
        marginTop: 5, // Espacio entre el texto y la línea
    },
    buttonText: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 12,
    }
});

