import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useGlobal from '../../core/global';

const ButtonGroup = () => {
  const [selected, setSelected] = useState('farms');
  const setSelectedGraph = useGlobal((state) => state.setSelectedGraph);

  const handlePress = (button) => {
    setSelected(button);
    setSelectedGraph(button);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handlePress('farms')}
        style={styles.button}
      >
        <Text style={[styles.text, selected === 'farms' && styles.selectedText]}>
          Comparar granjas
        </Text>
        <View
          style={[
            styles.underline,
            selected === 'farms' ? styles.visibleUnderline : styles.hiddenUnderline,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handlePress('batchs')}
        style={styles.button}
      >
        <Text style={[styles.text, selected === 'batchs' && styles.selectedText]}>
          Comparar lotes
        </Text>
        <View
          style={[
            styles.underline,
            selected === 'batchs' ? styles.visibleUnderline : styles.hiddenUnderline,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginLeft: 10,
    gap: 10,
  },
  button: {
    alignItems: 'center',
  },
  text: {
    color: '#4F4F4F',
    fontSize: 13,
    fontFamily: 'Montserrat_500Medium',
  },
  selectedText: {
    color: '#6cf5ad',
  },
  underline: {
    height: 4,  // Altura fija para el subrayado
    backgroundColor: '#6cf5ad',
    width: '100%',
    borderRadius: 25,
    marginTop: 2,
  },
  visibleUnderline: {
    opacity: 1,  // Subrayado visible
  },
  hiddenUnderline: {
    opacity: 0,  // Subrayado invisible pero con altura reservada
  },
});

export default ButtonGroup;