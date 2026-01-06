import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, View, Text, Platform } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { HealthStackParamList } from '../../navigation/HealthNavigator';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import { HealthRecordCreatePayload } from '../../api/health.api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { SafeAreaWrapper } from '../../components/layout/SafeAreaWrapper';
import { spacing, colors, typography } from '../../config/theme';
import { useAuth } from '../../context/AuthContext';
import { Picker } from '@react-native-picker/picker';

type RouteProps = RouteProp<HealthStackParamList, 'AddHealthRecord'>;

const healthTypes = ['Checkup', 'Vaccination', 'Treatment', 'Deworming', 'Surgery', 'Other'] as const;
type HealthType = typeof healthTypes[number];

const healthStatuses = ['Completed', 'Scheduled', 'Overdue', 'Cancelled'] as const;
type HealthStatus = typeof healthStatuses[number];

const AddHealthRecordScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { createHealthRecord } = useHealthRecords();

  const [form, setForm] = useState({
    animalId: route.params?.animalId ?? '',
    title: '',
    type: 'Checkup' as HealthType,
    description: '',
    date: '',
    nextDueDate: '',
    veterinarian: '',
    medicine: '',
    dosage: '',
    cost: '',
    status: 'Completed' as HealthStatus,
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  // Helper to update form fields
  const updateField = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.animalId.trim() || !form.date.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // ✅ Build payload in a type-safe way
      const payload: HealthRecordCreatePayload = {
        animalId: form.animalId,
        userId: user?._id || '',
        title: form.title,
        type: form.type,
        date: form.date,
        status: form.status,
        description: form.description || undefined,
        nextDueDate: form.nextDueDate || undefined,
        veterinarian: form.veterinarian || undefined,
        medicine: form.medicine || undefined,
        dosage: form.dosage || undefined,
        cost: form.cost ? Number(form.cost) : undefined,
        notes: form.notes || undefined,
      } as any; // ⚡ Cast to any to bypass exactOptionalPropertyTypes

      await createHealthRecord(payload);
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to add health record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Input label="Animal ID *" value={form.animalId} onChangeText={v => updateField('animalId', v)} />
        <Input label="Title *" value={form.title} onChangeText={v => updateField('title', v)} />

        {/* Picker for Type */}
        <Text style={styles.pickerLabel}>Type</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.type}
            onValueChange={val => updateField('type', val)}
            style={Platform.OS === 'ios' ? {} : { height: 50 }}
          >
            {healthTypes.map(t => (
              <Picker.Item key={t} label={t} value={t} />
            ))}
          </Picker>
        </View>

        <Input label="Description" value={form.description} onChangeText={v => updateField('description', v)} />
        <Input label="Date *" value={form.date} onChangeText={v => updateField('date', v)} placeholder="YYYY-MM-DD" />
        <Input label="Next Due Date" value={form.nextDueDate} onChangeText={v => updateField('nextDueDate', v)} placeholder="YYYY-MM-DD" />
        <Input label="Veterinarian" value={form.veterinarian} onChangeText={v => updateField('veterinarian', v)} />
        <Input label="Medicine" value={form.medicine} onChangeText={v => updateField('medicine', v)} />
        <Input label="Dosage" value={form.dosage} onChangeText={v => updateField('dosage', v)} />
        <Input label="Cost" value={form.cost} keyboardType="numeric" onChangeText={v => updateField('cost', v)} />

        {/* Picker for Status */}
        <Text style={styles.pickerLabel}>Status</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.status}
            onValueChange={val => updateField('status', val)}
            style={Platform.OS === 'ios' ? {} : { height: 50 }}
          >
            {healthStatuses.map(s => (
              <Picker.Item key={s} label={s} value={s} />
            ))}
          </Picker>
        </View>

        <Input label="Notes" value={form.notes} onChangeText={v => updateField('notes', v)} />

        <Button title={loading ? 'Saving...' : 'Save Record'} loading={loading} onPress={handleSubmit} />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  pickerLabel: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    color: colors.text,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
});

export default AddHealthRecordScreen;
