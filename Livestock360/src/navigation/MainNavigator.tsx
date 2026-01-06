// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import AnimalsNavigator from './AnimalsNavigator';
import HealthNavigator from './HealthNavigator';
import ProfileScreen from '../screens/profile/ProfileScreen';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../config/theme';

export type MainTabParamList = {
  Dashboard: undefined;
  Animals: undefined;
  Health: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const iconMap: Record<keyof MainTabParamList, string> = {
  Dashboard: 'home',
  Animals: 'database',
  Health: 'activity',
  Profile: 'user',
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 4,
          paddingTop: 4,
        },
        tabBarIcon: ({ color, size }) => (
          <Icon name={iconMap[route.name as keyof MainTabParamList]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Animals" component={AnimalsNavigator} />
      <Tab.Screen name="Health" component={HealthNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
