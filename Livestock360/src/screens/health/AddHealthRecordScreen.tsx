// src/screens/health/AddHealthRecordScreen.tsx
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { HealthStackParamList } from '../../navigation/HealthNavigator';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import { useAnimals } from '../../hooks/useAnimals';
import { HealthRecordCreatePayload } from '../../api/health.api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { SafeAreaWrapper } from '../../components/layout/SafeAreaWrapper';
import { spacing, colors } from '../../config/theme';
import Icon from 'react-native-vector-icons/Feather';

type RouteProps = RouteProp<HealthStackParamList, 'AddHealthRecord'>;

const healthTypes = ['Checkup', 'Vaccination', 'Treatment', 'Deworming', 'Surgery', 'Other'] as const;
type HealthType = typeof healthTypes[number];

const healthStatuses = ['Completed', 'Scheduled', 'Overdue', 'Cancelled'] as const;
type HealthStatus = typeof healthStatuses[number];

const AddHealthRecordScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { createHealthRecord } = useHealthRecords();
  const { animals } = useAnimals(); // ✅ Get list of animals

  const [selectedAnimal, setSelectedAnimal] = useState<{ _id: string; tagNumber: string; name?: string } | null>(null);
  const [showAnimalPicker, setShowAnimalPicker] = useState(false);

  const [form, setForm] = useState({
    title: '',
    type: 'Checkup' as HealthType,
    description: '',
    date: new Date().toISOString().split('T')[0],
    nextDueDate: '',
    veterinarian: '',
    medicine: '',
    dosage: '',
    cost: '',
    status: 'Completed' as HealthStatus,
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleStatusChange = (newStatus: HealthStatus) => {
    setForm(prev => ({ ...prev, status: newStatus }));
  };

  const handleTypeChange = (newType: HealthType) => {
    setForm(prev => ({ ...prev, type: newType }));
  };

  const handleAnimalSelect = (animal: typeof animals[0]) => {
    const selected: { _id: string; tagNumber: string; name?: string } = {
      _id: animal._id!,
      tagNumber: animal.tagNumber,
    };
    
    if (animal.name) {
      selected.name = animal.name;
    }
    
    setSelectedAnimal(selected);
    setShowAnimalPicker(false);
  };
  const handleSubmit = async () => {
    if (!selectedAnimal || !form.title.trim() || !form.date.trim()) {
      Alert.alert('Validation Error', 'Please select an animal and fill in required fields (Title, Date)');
      return;
    }

    setLoading(true);
    try {
      const payload: HealthRecordCreatePayload = {
        animalId: selectedAnimal._id, // ✅ Use the MongoDB _id
        title: form.title,
        type: form.type,
        date: form.date,
        status: form.status,
      };

      if (form.description.trim()) payload.description = form.description;
      if (form.nextDueDate.trim()) payload.nextDueDate = form.nextDueDate;
      if (form.veterinarian.trim()) payload.veterinarian = form.veterinarian;
      if (form.medicine.trim()) payload.medicine = form.medicine;
      if (form.dosage.trim()) payload.dosage = form.dosage;
      if (form.cost && !isNaN(Number(form.cost))) payload.cost = Number(form.cost);
      if (form.notes.trim()) payload.notes = form.notes;

      console.log('📤 Creating health record:', payload);

      await createHealthRecord(payload);
      
      Alert.alert('Success', 'Health record added successfully!');
      navigation.goBack();
    } catch (err: any) {
      console.error('❌ Failed to create health record:', err);
      Alert.alert('Error', err?.message || 'Failed to add health record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* ✅ Animal Selector */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Animal *</Text>
          <TouchableOpacity 
            style={styles.animalSelector}
            onPress={() => setShowAnimalPicker(true)}
          >
            <Text style={selectedAnimal ? styles.selectedAnimalText : styles.placeholderText}>
              {selectedAnimal 
                ? `${selectedAnimal.tagNumber} - ${selectedAnimal.name || 'Unnamed'}`
                : 'Tap to select animal'}
            </Text>
            <Icon name="chevron-down" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <Input label="Title *" value={form.title} onChangeText={v => updateField('title', v)} placeholder="e.g., Annual Checkup" />

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

        <Input label="Description" value={form.description} onChangeText={v => updateField('description', v)} multiline />
        <Input label="Date * (YYYY-MM-DD)" value={form.date} onChangeText={v => updateField('date', v)} placeholder="2025-01-07" />
        <Input label="Next Due Date (YYYY-MM-DD)" value={form.nextDueDate} onChangeText={v => updateField('nextDueDate', v)} placeholder="2026-01-07" />
        <Input label="Veterinarian" value={form.veterinarian} onChangeText={v => updateField('veterinarian', v)} />
        <Input label="Medicine" value={form.medicine} onChangeText={v => updateField('medicine', v)} />
        <Input label="Dosage" value={form.dosage} onChangeText={v => updateField('dosage', v)} />
        <Input label="Cost" value={form.cost} keyboardType="numeric" onChangeText={v => updateField('cost', v)} />

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

        <Input label="Notes" value={form.notes} onChangeText={v => updateField('notes', v)} multiline />

        <View style={styles.buttonContainer}>
          <Button title="Save Record" loading={loading} onPress={handleSubmit} />
        </View>
      </ScrollView>

      {/* ✅ Animal Picker Modal */}
      <Modal
        visible={showAnimalPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAnimalPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Animal</Text>
              <TouchableOpacity onPress={() => setShowAnimalPicker(false)}>
                <Icon name="x" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={animals}
              keyExtractor={(item) => item._id!}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.animalItem}
                  onPress={() => handleAnimalSelect(item)}
                >
                  <View>
                    <Text style={styles.animalTag}>{item.tagNumber}</Text>
                    <Text style={styles.animalName}>{item.name || 'Unnamed'}</Text>
                    <Text style={styles.animalType}>{item.type}</Text>
                  </View>
                  {selectedAnimal?._id === item._id && (
                    <Icon name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
  animalSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  selectedAnimalText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: 14,
    color: colors.textLight,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  animalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  animalTag: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  animalName: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
  },
  animalType: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
});

export default AddHealthRecordScreen;