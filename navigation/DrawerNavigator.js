import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
import { IconLayoutDashboardFilled, IconHeartRateMonitor, IconTool, IconMessage, IconUsersGroup } from '@tabler/icons-react-native';
import { COLORS } from '../constants/theme';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation }) => {
  return (
    <DrawerContentScrollView>
      <DrawerItem
        label="Dashboard"
        icon={({ color, size }) => <IconLayoutDashboardFilled color={color} size={size} />}
        onPress={() => navigation.navigate('BottomTabs', { screen: 'Dashboard' })}
      />
      <DrawerItem
        label="Assests"
        icon={({ color, size }) => <IconHeartRateMonitor color={color} size={size} />}
        onPress={() => navigation.navigate('BottomTabs', { screen: 'Assests' })}
      />
      <DrawerItem
        label="Incidents"
        icon={({ color, size }) => <IconTool color={color} size={size} />}
        onPress={() => navigation.navigate('BottomTabs', { screen: 'Incidents' })}
      />
      <DrawerItem
        label="Requests"
        icon={({ color, size }) => <IconMessage color={color} size={size} />}
        onPress={() => navigation.navigate('BottomTabs', { screen: 'Requests' })}
      />
      <DrawerItem
        label="Users"
        icon={({ color, size }) => <IconUsersGroup color={color} size={size} />}
        onPress={() => navigation.navigate('BottomTabs', { screen: 'Users' })}
      />
    </DrawerContentScrollView>
  );
};

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="BottomTabs" component={BottomTabs} />
    </Drawer.Navigator>
  );
}
