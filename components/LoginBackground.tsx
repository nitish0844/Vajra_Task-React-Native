import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '@/constants/theme';
import Constants from 'expo-constants';

const bg = require("../assets/images/login-background.jpg");
const logo = require("../assets/images/logo.png");

const LoginBackground = React.memo(() => {
  const version = Constants.expoConfig?.version || "1.0.0";

  return (
    <View style={styles.backgroundContainer}>
      <Image source={bg} style={styles.backgroundImage} />
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logoImage} resizeMode="contain" />
        <Text style={styles.versionText}>v {version}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    flex: 1,
    width: SIZES.width,
    resizeMode: "cover",
  },
  logoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    marginTop: SIZES.height / 7,
  },
  logoImage: {
    width: 150,
    height: 80,
  },
  versionText: {
    ...FONTS.body4,
    color: COLORS.primary,
    marginTop: SIZES.padding / 2,
    opacity: 0.8
  },
});

export default LoginBackground;