import React from 'react';
import { View, StyleSheet } from 'react-native';
import MultiColorGauge from '../../components/home/Incidents/MultiColorGauge';
import { SIZES } from '../../constants/theme';

const IncidentsChart = [
  { label: 'Open', value: 4, color: '#FF6B00' },
  { label: 'Closed', value: 6, color: '#1B2535' }
];

const callibration = [
  { label: 'Callibration', value: 247, color: '#1B2535' },
  { label: 'Not Callibrated', value: 12, color: '#8B9099' },
  { label: 'Not Required', value: 38, color: '#BBBEC3' },
];

const warrenty = [
  {label: 'Total', value: 267, color: '#1B2535'},
  {label: 'Requested', value: 12, color: '#8B9099'},
  {label: 'Expires soon', value: 7, color: '#FF6B00'},
]

const Incidents = () => {
  return (
    <View style={styles.container}>
      <MultiColorGauge size={200} data={IncidentsChart} title='Incidents' />
      <MultiColorGauge size={200} data={callibration} title='Callibration' />
      <MultiColorGauge size={200} data={warrenty} title='Warrenty' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: SIZES.padding
  },
});

export default Incidents;
