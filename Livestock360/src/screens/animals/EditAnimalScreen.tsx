import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Alert, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { AnimalsStackParamList } from '../../navigation/AnimalsNavigator';
import { useAnimals } from '../../hooks/useAnimals';
import { Animal } from '../../api/animal.api';
import Header from '../../components/layout/Header';
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
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadAnimal = async () => {
      try {
        const animal = await getAnimalById(animalId);
        if (animal) {
          console.log('🔍 Loaded animal from DB:', animal);
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
      } finally {
        setInitialLoading(false);
      }
    };

    loadAnimal();
  }, [animalId, getAnimalById]);

  const handleStatusChange = (newStatus: 'Healthy' | 'Attention' | 'Critical' | 'Unknown') => {
    console.log('🔄 STATUS CHANGE:', form.status, '->', newStatus);
    setForm(prevForm => ({
      ...prevForm,
      status: newStatus
    }));
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
  
      console.log('📤 Updating animal:', animalId, updateData);
  
      await updateAnimal(animalId, updateData as Partial<Animal>);
      
      Alert.alert('Success', 'Animal updated successfully!');
      navigation.goBack();
    } catch (e: any) {
      console.error('❌ Update failed:', e);
      Alert.alert('Error', e?.message || 'Failed to update animal');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <Header 
          title="Edit Animal"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading animal details...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Edit Animal"
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ Basic Information</Text>
          
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Tag Number</Text>
            <TextInput
              value={form.tagNumber}
              onChangeText={(v) => setForm({ ...form, tagNumber: v })}
              style={styles.input}
              placeholder="e.g., TAG-001"
              placeholderTextColor={colors.textLight}
            />

            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
              style={styles.input}
              placeholder="e.g., Daisy"
              placeholderTextColor={colors.textLight}
            />

            <Text style={styles.inputLabel}>Type</Text>
            <TextInput
              value={form.type}
              onChangeText={(v) => setForm({ ...form, type: v })}
              style={styles.input}
              placeholder="e.g., Cow"
              placeholderTextColor={colors.textLight}
            />

            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[styles.genderButton, form.gender === 'Male' && styles.genderButtonActive]}
                onPress={() => setForm({ ...form, gender: 'Male' })}
                activeOpacity={0.8}
              >
                <Text style={[styles.genderEmoji, form.gender === 'Male' && styles.genderEmojiActive]}>♂️</Text>
                <Text style={[styles.genderText, form.gender === 'Male' && styles.genderTextActive]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, form.gender === 'Female' && styles.genderButtonActive]}
                onPress={() => setForm({ ...form, gender: 'Female' })}
                activeOpacity={0.8}
              >
                <Text style={[styles.genderEmoji, form.gender === 'Female' && styles.genderEmojiActive]}>♀️</Text>
                <Text style={[styles.genderText, form.gender === 'Female' && styles.genderTextActive]}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Health & Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏥 Health & Details</Text>
          
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Health Status</Text>
            <View style={styles.statusContainer}>
              <TouchableOpacity
                style={[styles.statusButton, form.status === 'Healthy' && styles.statusHealthy]}
                onPress={() => handleStatusChange('Healthy')}
                activeOpacity={0.8}
              >
                <Text style={styles.statusEmoji}>✅</Text>
                <Text style={[styles.statusText, form.status === 'Healthy' && styles.statusTextActive]}>
                  Healthy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statusButton, form.status === 'Attention' && styles.statusAttention]}
                onPress={() => handleStatusChange('Attention')}
                activeOpacity={0.8}
              >
                <Text style={styles.statusEmoji}>⚠️</Text>
                <Text style={[styles.statusText, form.status === 'Attention' && styles.statusTextActive]}>
                  Attention
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statusButton, form.status === 'Critical' && styles.statusCritical]}
                onPress={() => handleStatusChange('Critical')}
                activeOpacity={0.8}
              >
                <Text style={styles.statusEmoji}>🚨</Text>
                <Text style={[styles.statusText, form.status === 'Critical' && styles.statusTextActive]}>
                  Critical
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statusButton, form.status === 'Unknown' && styles.statusUnknown]}
                onPress={() => handleStatusChange('Unknown')}
                activeOpacity={0.8}
              >
                <Text style={styles.statusEmoji}>❓</Text>
                <Text style={[styles.statusText, form.status === 'Unknown' && styles.statusTextActive]}>
                  Unknown
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Breed</Text>
            <TextInput
              value={form.breed}
              onChangeText={(v) => setForm({ ...form, breed: v })}
              style={styles.input}
              placeholder="e.g., Holstein"
              placeholderTextColor={colors.textLight}
            />

            <Text style={styles.inputLabel}>Weight (kg)</Text>
            <TextInput
              value={form.weight}
              onChangeText={(v) => setForm({ ...form, weight: v })}
              style={styles.input}
              placeholder="e.g., 250"
              keyboardType="numeric"
              placeholderTextColor={colors.textLight}
            />

            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              value={form.notes}
              onChangeText={(v) => setForm({ ...form, notes: v })}
              style={[styles.input, styles.textArea]}
              placeholder="Any additional information"
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Update Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>✓ Update Animal</Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

export default EditAnimalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textLight,
    fontSize: 14,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },

  // Section
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Inputs
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.background,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 100,
    paddingTop: spacing.sm,
  },

  // Gender Buttons
  genderContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  genderButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderEmoji: {
    fontSize: 24,
  },
  genderEmojiActive: {
    // Emoji stays the same
  },
  genderText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  genderTextActive: {
    color: colors.white,
  },

  // Status Buttons
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statusButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  statusHealthy: {
    backgroundColor: colors.success + '15',
    borderColor: colors.success,
  },
  statusAttention: {
    backgroundColor: colors.warning + '15',
    borderColor: colors.warning,
  },
  statusCritical: {
    backgroundColor: colors.error + '15',
    borderColor: colors.error,
  },
  statusUnknown: {
    backgroundColor: colors.textLight + '15',
    borderColor: colors.textLight,
  },
  statusEmoji: {
    fontSize: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  statusTextActive: {
    fontWeight: '700',
  },

  // Submit Button
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },

  bottomPadding: {
    height: spacing.xl,
  },
});