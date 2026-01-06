// src/navigation/HealthNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HealthRecordsScreen from '../screens/health/HealthRecordsScreen';
import AddHealthRecordScreen from '../screens/health/AddHealthRecordScreen';
import EditHealthRecordScreen from '../screens/health/EditHealthRecordScreen';
import UpcomingVaccinationsScreen from '../screens/health/UpcomingVaccinationsScreen';

export type HealthStackParamList = {
  HealthList: undefined;
  AddHealthRecord: { animalId?: string };
  EditHealthRecord: { recordId: string };
  UpcomingVaccinations: undefined;
};

const Stack = createNativeStackNavigator<HealthStackParamList>();

const HealthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="HealthList"
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen
        name="HealthList"
        component={HealthRecordsScreen}
        options={{ title: 'Health Records' }}
      />
      <Stack.Screen
        name="AddHealthRecord"
        component={AddHealthRecordScreen}
        options={{ title: 'Add Record' }}
      />
      <Stack.Screen
        name="EditHealthRecord"
        component={EditHealthRecordScreen}
        options={{ title: 'Edit Record' }}
      />
      <Stack.Screen
        name="UpcomingVaccinations"
        component={UpcomingVaccinationsScreen}
        options={{ title: 'Upcoming Vaccinations' }}
      />
    </Stack.Navigator>
  );
};

export default HealthNavigator;
