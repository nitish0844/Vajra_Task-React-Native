import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { IconAlertTriangle } from '@tabler/icons-react-native';
import { COLORS, SIZES } from '../../../constants/theme';

const data = [
  { id: '1', name: 'Ge ECG Machine', department: 'Intensive Care', assetId: 'AG-764569812', services: 4 },
  { id: '2', name: 'Ge ECG Machine', department: 'Intensive Care', assetId: 'AG-764569812', services: 10, alert: true },
  { id: '3', name: 'Ge ECG Machine', department: 'Intensive Care', assetId: 'AG-764569812', services: 5 },
  { id: '4', name: 'Ge ECG Machine', department: 'Intensive Care', assetId: 'AG-764569812', services: 6 },
  { id: '5', name: 'Ge ECG Machine', department: 'Intensive Care', assetId: 'AG-764569812', services: 4 },
  { id: '6', name: 'Ge ECG Machine', department: 'Intensive Care', assetId: 'AG-764569812', services: 4 },
];

const ServiceListCard = () => {
  const renderItem = ({ item }) => {
    const isAlert = item.alert;

    return (
      <View style={[styles.card, isAlert && styles.alertCard]}>
        <View>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subTitle}>{item.department}</Text>
          <Text style={styles.assetId}>{item.assetId}</Text>
        </View>

        <View style={[styles.rightBox, isAlert && styles.alertRightBox]}>
          {isAlert ? (
            <IconAlertTriangle color="#fff" size={24} />
          ) : null}
          <Text style={[styles.servicesText, isAlert && styles.alertServicesText]}>
            {String(item.services).padStart(2, '0')} <Text style={styles.servicesLabel}>Services</Text>
          </Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 10 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: SIZES.radius / 2,
    padding: SIZES.padding * 2,
    marginBottom: SIZES.padding * 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
  },
  alertCard: {
    backgroundColor: '#fff5f0',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: '#000',
    marginBottom: 2,
  },
  subTitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  assetId: {
    fontSize: 13,
    color: '#777',
  },
  rightBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: SIZES.padding,
    alignItems: 'center',
  },
  alertRightBox: {
    backgroundColor: "#FF8B38",
  },
  servicesText: {
    fontSize: 16,
    fontWeight: '700',
    color: "#FF8B38",
  },
  alertServicesText: {
    color: '#fff',
  },
  servicesLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default ServiceListCard;
