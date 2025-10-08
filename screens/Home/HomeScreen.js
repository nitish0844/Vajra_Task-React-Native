import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import {
  IconMenu2,
  IconLayoutGrid,
  IconCheck,
  IconQrcode,
} from '@tabler/icons-react-native';
import { useNavigation } from '@react-navigation/native';
import Assets from './Assets';
import Incidents from './Incidents';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('Assets'); // default selected tab

  const handleMenuPress = () => navigation.openDrawer();
  const handleGridPress = () => console.log('Grid pressed');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/Images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleGridPress} style={styles.iconButton}>
            <IconQrcode color={COLORS.white} size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMenuPress} style={styles.iconButton}>
            <IconMenu2 color={COLORS.white} size={24} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Hospital Card */}
      <View style={styles.card}>
        <Text style={styles.hospitalName}>ABC Hospital</Text>
        <Text style={styles.branchName}>Branch Name</Text>
        <Text style={styles.statusText}>All Assets are in order</Text>
        <Text style={styles.timer}>00 hr : 00 m : 00 s</Text>
        <View style={styles.checkIcon}>
          <IconCheck color={COLORS.white} size={SIZES.height * 0.08} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Square Blocks */}
        <View style={styles.blocksContainer}>
          {[
            { title: 'Dept', number: 25 },
            { title: 'Assets', number: 50 },
            { title: 'Check-in', number: 75 },
          ].map((item, index) => (
            <View key={index} style={styles.squareBlock}>
              <Text style={styles.blockNumber}>{item.number}</Text>
              <Text style={styles.blockTitle}>{item.title}</Text>
            </View>
          ))}
        </View>

        {/* Pill-shaped Tabs */}
        <View style={styles.tabContainer}>
          {['Assets', 'Incidents'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.tabButtonActive,
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {selectedTab === 'Assets' ? <Assets /> : <Incidents />}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    height: SIZES.height * 0.15,
    backgroundColor: '#1B2535',
    paddingHorizontal: SIZES.padding,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: { width: 120, height: 40, marginTop: SIZES.padding * 2 },
  headerRight: {
    flexDirection: 'row',
    right: SIZES.padding,
    marginTop: SIZES.padding * 2,
  },
  iconButton: { marginLeft: SIZES.padding },
  card: {
    position: 'absolute',
    top: SIZES.height * 0.1,
    left: SIZES.padding,
    right: SIZES.padding,
    borderRadius: SIZES.radius / 2,
    backgroundColor: COLORS.primary,
    padding: SIZES.padding * 2,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hospitalName: { color: COLORS.white, fontSize: 30, fontWeight: 'bold' },
  branchName: {
    color: COLORS.white,
    fontSize: 18,
    marginBottom: SIZES.padding * 2,
    fontWeight: 'bold',
  },
  statusText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  timer: {
    color: COLORS.white,
    fontSize: 16,
    marginTop: 5,
    fontWeight: 'bold',
  },
  checkIcon: {
    position: 'absolute',
    bottom: SIZES.padding * 4,
    right: SIZES.padding * 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blocksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SIZES.height * 0.18,
    marginHorizontal: 15,
  },
  squareBlock: {
    width: SIZES.width * 0.25,
    height: SIZES.height * 0.13,
    backgroundColor: '#fff',
    borderRadius: SIZES.radius / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  blockNumber: { color: COLORS.primary, fontSize: 24, fontWeight: 'bold' },
  blockTitle: { color: COLORS.black, fontSize: 14, marginTop: 5 },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.height * 0.03,
    padding: SIZES.padding,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: SIZES.padding,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: { color: COLORS.black, fontWeight: 'bold', fontSize: 18 },
  tabTextActive: { color: COLORS.white },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
