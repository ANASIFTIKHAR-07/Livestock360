// src/screens/health/EditHealthRecordScreen.tsx
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Alert, View, Text, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { HealthStackParamList } from '../../navigation/HealthNavigator';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import { HealthRecordUpdatePayload } from '../../api/health.api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { SafeAreaWrapper } from '../../components/layout/SafeAreaWrapper';
import { spacing, colors } from '../../config/theme';

type RouteProps = RouteProp<HealthStackParamList, 'EditHealthRecord'>;

const healthTypes = ['Checkup', 'Vaccination', 'Treatment', 'Deworming', 'Surgery', 'Other'] as const;
type HealthType = typeof healthTypes[number];

const healthStatuses = ['Completed', 'Scheduled', 'Overdue', 'Cancelled'] as const;
type HealthStatus = typeof healthStatuses[number];

// Form interface for string-based inputs
interface HealthRecordForm {
  title: string;
  type: HealthType;
  description: string;
  date: string;
  nextDueDate: string;
  notes: string;
  veterinarian: string;
  medicine: string;
  dosage: string;
  cost: string;
  status: HealthStatus;
}

const EditHealthRecordScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { recordId } = route.params;

  const { getHealthRecordById, updateHealthRecord, deleteHealthRecord } = useHealthRecords();

  const [form, setForm] = useState<HealthRecordForm>({
    title: '',
    type: 'Checkup',
    description: '',
    date: '',
    nextDueDate: '',
    notes: '',
    veterinarian: '',
    medicine: '',
    dosage: '',
    cost: '',
    status: 'Completed',
  });

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const record = await getHealthRecordById(recordId);
      if (record) {
        setForm({
          title: record.title || '',
          type: record.type || 'Checkup',
          description: record.description || '',
          date: record.date || '',
          nextDueDate: record.nextDueDate || '',
          notes: record.notes || '',
          veterinarian: record.veterinarian || '',
          medicine: record.medicine || '',
          dosage: record.dosage || '',
          cost: record.cost?.toString() || '',
          status: record.status || 'Completed',
        });
      }
    };
    load();
  }, [recordId]);

  const updateField = (key: keyof HealthRecordForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleStatusChange = (newStatus: HealthStatus) => {
    setForm(prev => ({ ...prev, status: newStatus }));
  };

  const handleTypeChange = (newType: HealthType) => {
    setForm(prev => ({ ...prev, type: newType }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.date.trim()) {
      Alert.alert('Validation Error', 'Title and Date are required');
      return;
    }

    setLoading(true);
    try {
      const updateData: HealthRecordUpdatePayload = {
        title: form.title,
        type: form.type,
        date: form.date,
        status: form.status,
      };

      if (form.description.trim()) updateData.description = form.description;
      if (form.nextDueDate.trim()) updateData.nextDueDate = form.nextDueDate;
      if (form.notes.trim()) updateData.notes = form.notes;
      if (form.veterinarian.trim()) updateData.veterinarian = form.veterinarian;
      if (form.medicine.trim()) updateData.medicine = form.medicine;
      if (form.dosage.trim()) updateData.dosage = form.dosage;
      if (form.cost && !isNaN(Number(form.cost))) updateData.cost = Number(form.cost);

      await updateHealthRecord(recordId, updateData);
      Alert.alert('Success', 'Health record updated successfully!');
      navigation.goBack();
    } catch (err: any) {
      console.error('Failed to update:', err);
      Alert.alert('Error', err?.message || 'Failed to update record');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this health record? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteHealthRecord(recordId);
              Alert.alert('Success', 'Health record deleted successfully!');
              navigation.goBack();
            } catch (err: any) {
              console.error('Failed to delete:', err);
              Alert.alert('Error', err?.message || 'Failed to delete record');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <Input 
          label="Title *" 
          value={form.title} 
          onChangeText={v => updateField('title', v)} 
          placeholder="e.g., Annual Checkup"
        />

        {/* Type Buttons */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Type *</Text>
          <View style={styles.buttonGrid}>
            {healthTypes.map(type => (
              <TouchableOpacity
                key={type}
                style={[styles.typeButton, form.type === type && styles.typeButtonActive]}
                onPress={() => handleTypeChange(type)}
              >
                <Text style={[styles.typeButtonText, form.type === type && styles.typeButtonTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Input 
          label="Description" 
          value={form.description} 
          onChangeText={v => updateField('description', v)} 
          multiline 
        />
        
        <Input 
          label="Date * (YYYY-MM-DD)" 
          value={form.date} 
          onChangeText={v => updateField('date', v)} 
          placeholder="2025-01-07"
        />
        
        <Input 
          label="Next Due Date (YYYY-MM-DD)" 
          value={form.nextDueDate} 
          onChangeText={v => updateField('nextDueDate', v)} 
          placeholder="2026-01-07"
        />
        
        <Input 
          label="Veterinarian" 
          value={form.veterinarian} 
          onChangeText={v => updateField('veterinarian', v)} 
        />
        
        <Input 
          label="Medicine" 
          value={form.medicine} 
          onChangeText={v => updateField('medicine', v)} 
        />
        
        <Input 
          label="Dosage" 
          value={form.dosage} 
          onChangeText={v => updateField('dosage', v)} 
        />
        
        <Input 
          label="Cost" 
          keyboardType="numeric"
          value={form.cost} 
          onChangeText={v => updateField('cost', v)} 
        />

        {/* Status Buttons */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.buttonGrid}>
            {healthStatuses.map(status => (
              <TouchableOpacity
                key={status}
                style={[styles.statusButton, form.status === status && styles.statusButtonActive]}
                onPress={() => handleStatusChange(status)}
              >
                <Text style={[styles.statusButtonText, form.status === status && styles.statusButtonTextActive]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Input 
          label="Notes" 
          value={form.notes} 
          onChangeText={v => updateField('notes', v)} 
          multiline 
        />

        <View style={styles.buttonContainer}>
          <Button 
            title="Update Record" 
            loading={loading} 
            onPress={handleSubmit} 
          />
          
          <Button 
            title="Delete Record" 
            loading={deleting}
            onPress={handleDelete}
            style={styles.deleteButton}
          />
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
    color: colors.text,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
    minWidth: '30%',
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
  },
  typeButtonText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  statusButton: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  statusButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
  },
  statusButtonText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  statusButtonTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  buttonContainer: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
});

export default EditHealthRecordScreen;