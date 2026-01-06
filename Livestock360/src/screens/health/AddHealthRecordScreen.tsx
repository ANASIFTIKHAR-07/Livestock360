import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { HealthStackParamList } from '../../navigation/HealthNavigator';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import { HealthRecordCreatePayload } from '../../api/health.api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { SafeAreaWrapper } from '../../components/layout/SafeAreaWrapper';
import { spacing } from '../../config/theme';
import { useAuth } from '../../context/AuthContext';

type RouteProps = RouteProp<HealthStackParamList, 'AddHealthRecord'>;

// Form interface for string-based inputs
interface HealthRecordForm {
  animalId: string;
  title: string;
  type: string;
  description: string;
  date: string;
  nextDueDate: string;
  veterinarian: string;
  medicine: string;
  dosage: string;
  cost: string;
  status: string;
  notes: string;
}

const AddHealthRecordScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { createHealthRecord } = useHealthRecords();

  const [form, setForm] = useState<HealthRecordForm>({
    animalId: route.params?.animalId ?? '',
    title: '',
    type: 'Checkup',
    description: '',
    date: '',
    nextDueDate: '',
    veterinarian: '',
    medicine: '',
    dosage: '',
    cost: '',
    status: 'Completed',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.animalId || !form.date) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Build create payload
      const createData: Record<string, any> = {
        animalId: form.animalId,
        userId: user?._id || '',
        title: form.title,
        type: form.type,
        date: form.date,
      };

      if (form.description) createData.description = form.description;
      if (form.nextDueDate) createData.nextDueDate = form.nextDueDate;
      if (form.veterinarian) createData.veterinarian = form.veterinarian;
      if (form.medicine) createData.medicine = form.medicine;
      if (form.dosage) createData.dosage = form.dosage;
      if (form.cost) createData.cost = Number(form.cost);
      if (form.status) createData.status = form.status;
      if (form.notes) createData.notes = form.notes;

      await createHealthRecord(createData as HealthRecordCreatePayload);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add health record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Input 
          label="Animal ID *" 
          value={form.animalId} 
          onChangeText={(v) => setForm({ ...form, animalId: v })} 
        />
        <Input 
          label="Title *" 
          value={form.title} 
          onChangeText={(v) => setForm({ ...form, title: v })} 
        />
        <Input 
          label="Type" 
          value={form.type} 
          onChangeText={(v) => setForm({ ...form, type: v })} 
          placeholder="Vaccination, Treatment, Checkup, etc."
        />
        <Input 
          label="Description" 
          value={form.description} 
          onChangeText={(v) => setForm({ ...form, description: v })} 
        />
        <Input 
          label="Date *" 
          value={form.date} 
          onChangeText={(v) => setForm({ ...form, date: v })}
          placeholder="YYYY-MM-DD"
        />
        <Input 
          label="Next Due Date" 
          value={form.nextDueDate} 
          onChangeText={(v) => setForm({ ...form, nextDueDate: v })}
          placeholder="YYYY-MM-DD"
        />
        <Input 
          label="Veterinarian" 
          value={form.veterinarian} 
          onChangeText={(v) => setForm({ ...form, veterinarian: v })} 
        />
        <Input 
          label="Medicine" 
          value={form.medicine} 
          onChangeText={(v) => setForm({ ...form, medicine: v })} 
        />
        <Input 
          label="Dosage" 
          value={form.dosage} 
          onChangeText={(v) => setForm({ ...form, dosage: v })} 
        />
        <Input 
          label="Cost" 
          keyboardType="numeric" 
          value={form.cost} 
          onChangeText={(v) => setForm({ ...form, cost: v })} 
        />
        <Input 
          label="Status" 
          value={form.status} 
          onChangeText={(v) => setForm({ ...form, status: v })}
          placeholder="Completed, Scheduled, etc."
        />
        <Input 
          label="Notes" 
          value={form.notes} 
          onChangeText={(v) => setForm({ ...form, notes: v })} 
        />

        <Button title="Save Record" loading={loading} onPress={handleSubmit} />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
});

export default AddHealthRecordScreen;