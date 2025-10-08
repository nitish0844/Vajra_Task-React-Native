import 'react-native-reanimated';

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import RootStack from './navigation/RootStack';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={"#1B2535"}
        barStyle="light-content" 
      />
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1B2535", // optional: background behind status bar
  },
});
