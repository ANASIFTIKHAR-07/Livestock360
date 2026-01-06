// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import AnimalsNavigator from './AnimalsNavigator';
import HealthNavigator from './HealthNavigator';
import ProfileScreen from '../screens/profile/ProfileScreen.tsx';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../config/theme';

export type MainTabParamList = {
  Dashboard: undefined;
  Animals: undefined;
  Health: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

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
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'home';

          switch (route.name) {
            case 'Dashboard':
              iconName = 'home';
              break;
            case 'Animals':
              iconName = 'database';
              break;
            case 'Health':
              iconName = 'activity';
              break;
            case 'Profile':
              iconName = 'user';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
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
