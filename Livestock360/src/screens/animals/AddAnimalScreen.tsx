import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { spacing, colors  } from '../../config/theme';
import {
  createAnimal,
  CreateAnimalPayload,
  Animal,
} from '../../api/animal.api';
import { useNavigation } from '@react-navigation/native';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/layout/Header';

const AddAnimalScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { image, pickImage, clearImage } = useImagePicker();

  const [tagNumber, setTagNumber] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<Animal['type']>('Cow');
  const [gender, setGender] = useState<Animal['gender']>('Male');
  const [birthDate, setBirthDate] = useState('');
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!tagNumber.trim()) {
      Alert.alert('Error', 'Tag number is required');
      return;
    }
  
    if (!birthDate) {
      Alert.alert('Error', 'Birth date is required');
      return;
    }
  
    try {
      setLoading(true);
      
      const payload: CreateAnimalPayload = {
        tagNumber: tagNumber.trim(),
        type,
        gender,
        birthDate,
        
      };
  
      const trimmedName = name.trim();
      if (trimmedName) payload.name = trimmedName;
      
      const trimmedBreed = breed.trim();
      if (trimmedBreed) payload.breed = trimmedBreed;
      
      const parsedWeight = Number(weight);
      if (weight && !isNaN(parsedWeight)) payload.weight = parsedWeight;
      
      const trimmedNotes = notes.trim();
      if (trimmedNotes) payload.notes = trimmedNotes;
  
      console.log('📤 Submitting animal:', payload);
      
      await createAnimal(payload, image || undefined);
      
      Alert.alert('Success', 'Animal added successfully!');
      navigation.goBack();
      
    } catch (err: any) {
      console.error('❌ Failed to create animal:', err);
      Alert.alert('Error', err.message || 'Failed to create animal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Add Animal"
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo Section */}
        <View style={styles.photoSection}>
          <Text style={styles.sectionTitle}>📷 Animal Photo</Text>
          {image ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: image.uri }}
                style={styles.imagePreview}
              />
              <TouchableOpacity 
                style={styles.removePhotoButton}
                onPress={clearImage}
                activeOpacity={0.8}
              >
                <Text style={styles.removePhotoText}>✕ Remove Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={pickImage}
              activeOpacity={0.8}
            >
              <Text style={styles.uploadIcon}>📸</Text>
              <Text style={styles.uploadText}>Tap to add photo</Text>
              <Text style={styles.uploadSubtext}>Optional</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ Basic Information</Text>
          
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Tag Number *</Text>
            <TextInput
              value={tagNumber}
              onChangeText={setTagNumber}
              style={styles.input}
              placeholder="e.g., TAG-001"
              placeholderTextColor={colors.textLight}
            />

            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="e.g., Daisy (Optional)"
              placeholderTextColor={colors.textLight}
            />

            <Text style={styles.inputLabel}>Type *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={type}
                onValueChange={val => setType(val as Animal['type'])}
                style={styles.picker}
              >
                {['Cow', 'Buffalo', 'Goat', 'Sheep', 'Camel', 'Other'].map(t => (
                  <Picker.Item key={t} label={`${getAnimalEmoji(t)} ${t}`} value={t} />
                ))}
              </Picker>
            </View>

            <Text style={styles.inputLabel}>Gender *</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'Male' && styles.genderButtonActive]}
                onPress={() => setGender('Male')}
                activeOpacity={0.8}
              >
                <Text style={[styles.genderEmoji, gender === 'Male' && styles.genderEmojiActive]}>♂️</Text>
                <Text style={[styles.genderText, gender === 'Male' && styles.genderTextActive]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'Female' && styles.genderButtonActive]}
                onPress={() => setGender('Female')}
                activeOpacity={0.8}
              >
                <Text style={[styles.genderEmoji, gender === 'Female' && styles.genderEmojiActive]}>♀️</Text>
                <Text style={[styles.genderText, gender === 'Female' && styles.genderTextActive]}>Female</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Birth Date *</Text>
            <TextInput
              value={birthDate}
              onChangeText={setBirthDate}
              style={styles.input}
              placeholder="YYYY-MM-DD (e.g., 2024-01-15)"
              placeholderTextColor={colors.textLight}
            />
          </View>
        </View>

        {/* Additional Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Additional Details</Text>
          
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Breed</Text>
            <TextInput
              value={breed}
              onChangeText={setBreed}
              style={styles.input}
              placeholder="e.g., Holstein (Optional)"
              placeholderTextColor={colors.textLight}
            />

            <Text style={styles.inputLabel}>Weight (kg)</Text>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              style={styles.input}
              placeholder="e.g., 250 (Optional)"
              keyboardType="numeric"
              placeholderTextColor={colors.textLight}
            />

            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              style={[styles.input, styles.textArea]}
              placeholder="Any additional information (Optional)"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor={colors.textLight}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Text style={styles.submitButtonText}>✓ Add Animal</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

// Helper function for animal emojis
const getAnimalEmoji = (type: string): string => {
  const emojis: Record<string, string> = {
    'Cow': '🐄',
    'Buffalo': '🐃',
    'Goat': '🐐',
    'Sheep': '🐑',
    'Camel': '🐫',
    'Other': '🦙',
  };
  return emojis[type] || '🐄';
};

export default AddAnimalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },

  // Photo Section
  photoSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  uploadButton: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 13,
    color: colors.textLight,
  },
  imageContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  removePhotoButton: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  removePhotoText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },

  // Section
  section: {
    marginBottom: spacing.lg,
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

  // Picker
  pickerContainer: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: spacing.sm,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  picker: {
    height: 52,
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