import { StyleSheet, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ServicesBarChart from '../../components/home/Assets/ServicesBarChart';
import ServiceListCard from '../../components/home/Assets/ServiceListCard';
import { Text } from 'react-native-gesture-handler';
import { IconArrowRight } from '@tabler/icons-react-native';
import { COLORS, SIZES } from '../../constants/theme';

const Assets = () => {
  return (
    <View style={styles.container}>
      <ServicesBarChart />

      <ServiceListCard />

      <TouchableOpacity style={styles.allServices}>
        <Text style={styles.AllServiceText}>All Services</Text>
        <IconArrowRight size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    padding: SIZES.padding
  },
  allServices: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.base * 2,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    gap: 5,
    alignItems: "center",
    margin: SIZES.base,
    width: SIZES.width * 0.8
  },
  AllServiceText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "900"
  }
});

export default Assets