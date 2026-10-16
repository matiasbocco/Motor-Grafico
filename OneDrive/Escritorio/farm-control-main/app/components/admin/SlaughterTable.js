import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

const SlaughterTable = ({ data }) => {
  const tableHead = ['Camión', 'Granja', 'Galpón', 'Edad', 'Cliente', 'Pollos', 'Kg', 'Peso Promedio'];
  const setTableData = () => {
    let tableData = [];
    data.map((slaughter, index) => {
      const rowData = [];
      rowData.push(slaughter.truck);
      rowData.push(slaughter.farm);
      rowData.push(slaughter.shed);
      rowData.push(slaughter.age);
      rowData.push(slaughter.client);
      rowData.push(slaughter.chiquens);
      rowData.push(slaughter.weight);
      rowData.push(slaughter.average_weight);
      tableData.push(rowData);
    });
    return tableData;
  };
  const tableData = setTableData();
  const widthArr = [50, 60, 35, 30, 60, 35, 35, 50];
  return (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 0.5, borderColor: '#000' }}>
        <Row
          data={tableHead}
          style={styles.head}
          widthArr={widthArr}
          textStyle={styles.text}
        />
        <Rows
          data={tableData}
          style={styles.row}
          widthArr={widthArr}
          textStyle={styles.text}
        />
      </Table>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  head: {
    height: 30,
    backgroundColor: '#6cf5ad',
  },
  row: {
    height: 30,
    backgroundColor: '#F8F8F8',
  },
  text: {
    margin: 1,
    textAlign: 'center',
    fontSize: 9,
  },
});

export default SlaughterTable;