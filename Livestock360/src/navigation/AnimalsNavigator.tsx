// src/navigation/AnimalsNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnimalListScreen from '../screens/animals/AnimalListScreen';
import EditAnimalScreen from '../screens/animals/EditAnimalScreen';
import AnimalDetailScreen from '../screens/animals/AnimalDetailScreen';
import AddAnimalScreen from '../screens/animals/AddAnimalScreen';
import { colors } from '../config/theme';

export type AnimalsStackParamList = {
  AnimalList: undefined;
  AddAnimal: undefined;
  EditAnimal: { animalId: string };
  AnimalDetail: { animalId: string };
};

const Stack = createNativeStackNavigator<AnimalsStackParamList>();

const AnimalsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="AnimalList"
      screenOptions={{
        headerStyle: { 
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerShadowVisible: true,
        animation: 'slide_from_right',
      }}
    >
      {/* IMPORTANT: AnimalList MUST be first for initialRouteName to work properly */}
      <Stack.Screen
        name="AnimalList"
        component={AnimalListScreen}
        options={{ 
          title: 'My Animals',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AddAnimal"
        component={AddAnimalScreen}
        options={{ 
          title: 'Add New Animal',
          headerShown: true,
          presentation: 'modal', // Make it feel like an overlay
        }}
      />
      <Stack.Screen
        name="EditAnimal"
        component={EditAnimalScreen}
        options={{ 
          title: 'Edit Animal',
          headerShown: true,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="AnimalDetail"
        component={AnimalDetailScreen}
        options={{ 
          title: 'Animal Details',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default AnimalsNavigator;