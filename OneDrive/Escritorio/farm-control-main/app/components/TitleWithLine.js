import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TitleWithLine = ({ title }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 10, 
  },
  line: {
    width: 5, 
    height: 25, 
    backgroundColor: '#6cf5ad', 
    marginRight: 10, 
    borderRadius: 10, 
  },
  title: {
    fontSize: 18, 
    fontWeight: 'bold', 
    fontFamily: 'Montserrat_500Medium', 
  },
});

export default TitleWithLine;