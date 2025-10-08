import React from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { COLORS, SIZES } from '../../../constants/theme';
import { IconPlus } from '@tabler/icons-react-native';

const screenWidth = Dimensions.get('window').width - 40;

const data = {
  labels: ['Blood', 'Emer...', 'ICU', 'Blood', 'Lab', 'Lab', 'Lab'],
  datasets: [
    {
      data: [1, 3, 4, 2, 5, 2, 4],
      colors: [
        (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
        (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
        (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
        (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
        (opacity = 1) => `rgba(255, 140, 0, ${opacity})`,
        (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
        (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
      ],
    },
  ],
};

const ServicesBarChart = () => {
  return (
    <View style={styles.elevatedContainer}>
      <Text style={styles.title}>Services</Text>

      <View style={styles.row}>
        <Text>No of Services</Text>
        <Text style={styles.subtitle}>01 Dept needs attention</Text>
      </View>

      <ScrollView horizontal>
        <BarChart
          data={data}
          width={screenWidth * 1.5}
          height={220}
          fromZero
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
          }}
          style={styles.chart}
        />
      </ScrollView>

      {/* Flexbox-aligned button */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.viewAllButton}>
          <IconPlus color="#fff" size={20} />
          <Text style={styles.viewAllText}>Add New</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  elevatedContainer: {
    padding: SIZES.padding * 2,
    backgroundColor: '#fff',
    borderRadius: SIZES.radius,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 8,
    margin: 10,
    flex: 1,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 14, color: 'orange', marginBottom: 10 },
  chart: { marginVertical: 8, borderRadius: 16 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // aligns to the right
    marginTop: SIZES.padding,
  },
  viewAllButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.base * 2,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    gap: 5,
  },
  viewAllText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ServicesBarChart;
