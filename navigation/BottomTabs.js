import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  IconHome,
  IconCloudUpload,
  IconSettings,
  IconLayoutDashboardFilled,
  IconHeartRateMonitor,
  IconTool,
  IconMessage,
  IconUsersGroup,
} from '@tabler/icons-react-native';
import HomeScreen from '../screens/Home/HomeScreen';
import CommingZoon from '../screens/CommingSoon/CommingZoon';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let IconComponent;

          switch (route.name) {
            case 'Dashboard':
              IconComponent = IconLayoutDashboardFilled;
              break;
            case 'Assests':
              IconComponent = IconHeartRateMonitor;
              break;
            case 'Incidents':
              IconComponent = IconTool;
              break;
            case 'Requests':
              IconComponent = IconMessage;
              break;
            case 'Users':
              IconComponent = IconUsersGroup;
              break;
            default:
              IconComponent = IconHome;
          }

          return <IconComponent size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen name="Dashboard" component={HomeScreen} />
      <Tab.Screen name="Assests" component={CommingZoon} />
      <Tab.Screen name="Incidents" component={CommingZoon} />
      <Tab.Screen name="Requests" component={CommingZoon} />
      <Tab.Screen name="Users" component={CommingZoon} />
    </Tab.Navigator>
  );
}
