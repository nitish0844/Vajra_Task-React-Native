import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconWifi, IconWifiOff } from '@tabler/icons-react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

export const IndicatorPill = ({ isConnected }) => {
  const IconComp = isConnected ? IconWifi : IconWifiOff;
  return (
    <View style={[styles.pill, isConnected ? { backgroundColor: COLORS.success } : undefined]}>
      <IconComp size={18} color={COLORS.white} strokeWidth={1.5} />
      <Text style={styles.internetText}>{isConnected ? "Online" : "Offline"}</Text>
    </View>
  )
}

const NetworkIndicator = ({ isConnected }) => {
  const IconComp = isConnected ? IconWifi : IconWifiOff;
  return (
    <View style={styles.noInternetViewContainer}>
      <View style={[styles.pill, isConnected ? { backgroundColor: COLORS.success } : undefined]}>
        <IconComp
          size={18}
          color={COLORS.white}
          // style={styles.noInternetIcon}
          strokeWidth={1.5}
        />
        <Text style={styles.internetText}>{isConnected ? "Online" : "Not connected to internet."}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  noInternetViewContainer: {
    // paddingHorizontal: SIZES.padding * 2,
    // marginBottom: SIZES.padding,
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  },
  pill: {
    backgroundColor: COLORS.dangerDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.padding / 2,
    borderRadius: SIZES.padding * 2,
    paddingHorizontal: SIZES.padding,
  },
  noInternetIcon: {
    marginTop: 1
  },
  internetText: {
    ...FONTS.h6,
    color: COLORS.white,
    marginLeft: SIZES.base / 2,
  }
});

export default NetworkIndicator;

