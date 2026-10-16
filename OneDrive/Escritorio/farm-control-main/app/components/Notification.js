import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Image } from 'react-native';

const NotificationComponent = ({source}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
      <Image 
        source={ source }
        style = {styles.buttonImage}
        />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            {/* Tocar fuera de la ventana de notificaciones para cerrar */}
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Contenido de la ventana de notificaciones */}
                <Text>Notificación 1</Text>
                <Text>Notificación 2</Text>
                {/* ... */}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginLeft: 42
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start', // Alinea la ventana al inicio del eje principal (arriba)
    alignItems: 'flex-end', // Alinea la ventana al final del eje transversal (derecha)
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
  },
  modalContent: {
    height: '30%', // Altura menor para la ventana
    width: '50%', // Ancho de la ventana
    backgroundColor: 'white',
    padding: 20,
    borderBottomLeftRadius: 20, // Bordes redondeados en la parte inferior izquierda
    borderTopRightRadius: 20, // Bordes redondeados en la parte superior derecha
    marginTop: 35,
    marginRight: 30
    // ... otros estilos para la ventana de notificaciones
  },
  buttonImage: {
    width: 30,
    height: 30,
},
});

export default NotificationComponent;