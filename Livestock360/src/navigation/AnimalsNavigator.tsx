import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnimalListScreen from '../screens/animals/AnimalListScreen';
import EditAnimalScreen from '../screens/animals/EditAnimalScreen';
import AnimalDetailScreen from '../screens/animals/AnimalDetailScreen';

export type AnimalsStackParamList = {
  AnimalList: undefined;
  EditAnimal: { animalId: string };
  AnimalDetail: { animalId: string }; // ✅ Add this for AnimalDetailScreen
};

const Stack = createNativeStackNavigator<AnimalsStackParamList>();

const AnimalsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#f8f8f8' },
        headerTintColor: '#333',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="AnimalList"
        component={AnimalListScreen}
        options={{ title: 'Animals' }}
      />
      <Stack.Screen
        name="EditAnimal"
        component={EditAnimalScreen}
        options={{ title: 'Edit Animal' }}
      />
      <Stack.Screen
        name="AnimalDetail"
        component={AnimalDetailScreen}
        options={{ title: 'Animal Details' }}
      />
    </Stack.Navigator>
  );
};

export default AnimalsNavigator;
