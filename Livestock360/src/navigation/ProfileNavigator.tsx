// src/navigation/ProfileNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AboutScreen from '../screens/profile/AboutScreen';
import { colors } from '../config/theme';

export type ProfileStackParamList = {
  ProfileMain: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileMain"
      screenOptions={{
        headerStyle: { 
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerShadowVisible: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ 
          headerShown: false, // Profile has its own Header component
        }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ 
          headerShown: false, // About has its own Header component
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;