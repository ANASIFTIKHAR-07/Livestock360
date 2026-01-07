import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Alert, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { AnimalsStackParamList } from '../../navigation/AnimalsNavigator';
import { useAnimals } from '../../hooks/useAnimals';
import { Animal } from '../../api/animal.api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { SafeAreaWrapper } from '../../components/layout/SafeAreaWrapper';
import { spacing, colors } from '../../config/theme';

type RouteProps = RouteProp<AnimalsStackParamList, 'EditAnimal'>;

interface AnimalForm {
  tagNumber: string;
  name: string;
  type: string;
  breed: string;
  gender: string;
  weight: string;
  status: 'Healthy' | 'Attention' | 'Critical' | 'Unknown';
  notes: string;
}

const EditAnimalScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { animalId } = route.params;

  const { getAnimalById, updateAnimal } = useAnimals();

  const [form, setForm] = useState<AnimalForm>({
    tagNumber: '',
    name: '',
    type: '',
    breed: '',
    gender: '',
    weight: '',
    status: 'Healthy',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAnimal = async () => {
      const animal = await getAnimalById(animalId);
      if (animal) {
        console.log('🔍 Loaded animal from DB:', animal);
        console.log('🔍 Animal status from DB:', animal.status);
        setForm({
          tagNumber: animal.tagNumber || '',
          name: animal.name || '',
          type: animal.type || '',
          breed: animal.breed || '',
          gender: animal.gender || '',
          weight: animal.weight?.toString() || '',
          status: animal.status || 'Healthy',
          notes: animal.notes || '',
        });
      }
    };

    loadAnimal();
  }, [animalId, getAnimalById]);

  // ✅ Separate function to update status
  const handleStatusChange = (newStatus: 'Healthy' | 'Attention' | 'Critical' | 'Unknown') => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔄 STATUS CHANGE TRIGGERED');
    console.log('Previous status:', form.status);
    console.log('New status:', newStatus);
    
    setForm(prevForm => {
      const updated = {
        ...prevForm,
        status: newStatus
      };
      console.log('Updated form:', updated);
      console.log('Updated status in form:', updated.status);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return updated;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updateData: Record<string, any> = {};
  
      if (form.tagNumber) updateData.tagNumber = form.tagNumber;
      if (form.name) updateData.name = form.name;
      if (form.type) updateData.type = form.type;
      if (form.breed) updateData.breed = form.breed;
      if (form.gender) updateData.gender = form.gender;
      if (form.status) updateData.status = form.status;
      if (form.notes) updateData.notes = form.notes;
      if (form.weight) updateData.weight = Number(form.weight);
  
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔍 EDIT ANIMAL - BEFORE UPDATE');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Animal ID:', animalId);
      console.log('Form Status:', form.status);
      console.log('UpdateData Status:', updateData.status);
      console.log('UpdateData Full:', JSON.stringify(updateData, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
      await updateAnimal(animalId, updateData as Partial<Animal>);
      
      console.log('✅ Update call completed');
  
      Alert.alert('Success', 'Animal updated successfully!');
      navigation.goBack();
    } catch (e: any) {
      console.error('❌ Update failed:', e);
      Alert.alert('Error', e?.message || 'Failed to update animal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Input 
          label="Tag Number" 
          value={form.tagNumber} 
          onChangeText={(v) => setForm({ ...form, tagNumber: v })} 
        />
        <Input 
          label="Name" 
          value={form.name} 
          onChangeText={(v) => setForm({ ...form, name: v })} 
        />
        <Input 
          label="Type" 
          value={form.type} 
          onChangeText={(v) => setForm({ ...form, type: v })} 
        />
        <Input 
          label="Breed" 
          value={form.breed} 
          onChangeText={(v) => setForm({ ...form, breed: v })} 
        />
        <Input 
          label="Gender" 
          value={form.gender} 
          onChangeText={(v) => setForm({ ...form, gender: v })} 
        />
        <Input 
          label="Weight (kg)" 
          keyboardType="numeric" 
          value={form.weight} 
          onChangeText={(v) => setForm({ ...form, weight: v })} 
        />

        {/* ✅ Health Status Buttons */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Health Status</Text>
          <View style={styles.statusButtons}>
            <TouchableOpacity
              style={[styles.statusButton, form.status === 'Healthy' && styles.statusButtonActive]}
              onPress={() => handleStatusChange('Healthy')}
              activeOpacity={0.7}
            >
              <Text style={[styles.statusButtonText, form.status === 'Healthy' && styles.statusButtonTextActive]}>
                🟢 Healthy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statusButton, form.status === 'Attention' && styles.statusButtonActive]}
              onPress={() => handleStatusChange('Attention')}
              activeOpacity={0.7}
            >
              <Text style={[styles.statusButtonText, form.status === 'Attention' && styles.statusButtonTextActive]}>
                🟡 Attention
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statusButton, form.status === 'Critical' && styles.statusButtonActive]}
              onPress={() => handleStatusChange('Critical')}
              activeOpacity={0.7}
            >
              <Text style={[styles.statusButtonText, form.status === 'Critical' && styles.statusButtonTextActive]}>
                🔴 Critical
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statusButton, form.status === 'Unknown' && styles.statusButtonActive]}
              onPress={() => handleStatusChange('Unknown')}
              activeOpacity={0.7}
            >
              <Text style={[styles.statusButtonText, form.status === 'Unknown' && styles.statusButtonTextActive]}>
                ⚪ Unknown
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.debugText}>Current: {form.status}</Text>
        </View>

        {/* ✅ Notes Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.textArea}
            value={form.notes}
            onChangeText={(v) => setForm({ ...form, notes: v })}
            placeholder="Enter notes (optional)"
            placeholderTextColor={colors.textLight}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* ✅ Button with proper spacing */}
        <View style={styles.buttonContainer}>
          <Button title="Update Animal" loading={loading} onPress={handleSubmit} />
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
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statusButton: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.md,
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
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  statusButtonTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  debugText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    padding: 12,
    minHeight: 100,
    color: colors.text,
  },
  buttonContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});

export default EditAnimalScreen;