import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { HealthStackParamList } from '../../navigation/HealthNavigator';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import { HealthRecordUpdatePayload } from '../../api/health.api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { SafeAreaWrapper } from '../../components/layout/SafeAreaWrapper';
import { spacing } from '../../config/theme';

type RouteProps = RouteProp<HealthStackParamList, 'EditHealthRecord'>;

// Form interface for string-based inputs
interface HealthRecordForm {
  title: string;
  description: string;
  notes: string;
  veterinarian: string;
  medicine: string;
  dosage: string;
  cost: string;
}

const EditHealthRecordScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { recordId } = route.params;

  const { getHealthRecordById, updateHealthRecord } = useHealthRecords();

  const [form, setForm] = useState<HealthRecordForm>({
    title: '',
    description: '',
    notes: '',
    veterinarian: '',
    medicine: '',
    dosage: '',
    cost: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const record = await getHealthRecordById(recordId);
      if (record) {
        setForm({
          title: record.title || '',
          description: record.description || '',
          notes: record.notes || '',
          veterinarian: record.veterinarian || '',
          medicine: record.medicine || '',
          dosage: record.dosage || '',
          cost: record.cost?.toString() || '',
        });
      }
    };
    load();
  }, [recordId]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Build update payload
      const updateData: Record<string, any> = {};

      if (form.title) updateData.title = form.title;
      if (form.description) updateData.description = form.description;
      if (form.notes) updateData.notes = form.notes;
      if (form.veterinarian) updateData.veterinarian = form.veterinarian;
      if (form.medicine) updateData.medicine = form.medicine;
      if (form.dosage) updateData.dosage = form.dosage;
      if (form.cost) updateData.cost = Number(form.cost);

      await updateHealthRecord(recordId, updateData as HealthRecordUpdatePayload);
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to update record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Input 
          label="Title" 
          value={form.title} 
          onChangeText={(v) => setForm({ ...form, title: v })} 
        />
        <Input 
          label="Description" 
          value={form.description} 
          onChangeText={(v) => setForm({ ...form, description: v })} 
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
          label="Notes" 
          value={form.notes} 
          onChangeText={(v) => setForm({ ...form, notes: v })} 
        />

        <Button title="Update Record" loading={loading} onPress={handleSubmit} />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
});

export default EditHealthRecordScreen;