import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { spacing, colors, typography } from '../../config/theme';
import {
  createAnimal,
  CreateAnimalPayload,
  Animal,
} from '../../api/animal.api';
import { useNavigation } from '@react-navigation/native';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useAuth } from '../../context/AuthContext';

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
      
      // Build payload with only required fields first
      const payload: CreateAnimalPayload = {
        tagNumber: tagNumber.trim(),
        type,
        gender,
        birthDate,
      };
  
      // Conditionally add optional fields only if they have values
      const trimmedName = name.trim();
      if (trimmedName) payload.name = trimmedName;
      
      const trimmedBreed = breed.trim();
      if (trimmedBreed) payload.breed = trimmedBreed;
      
      const parsedWeight = Number(weight);
      if (weight && !isNaN(parsedWeight)) payload.weight = parsedWeight;
      
      const trimmedNotes = notes.trim();
      if (trimmedNotes) payload.notes = trimmedNotes;
  
      console.log('📤 Submitting animal:', payload);
      
      // Call API - pass image directly (not cast to File)
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add Animal</Text>

      <Text style={styles.label}>Tag Number *</Text>
      <TextInput
        value={tagNumber}
        onChangeText={setTagNumber}
        style={styles.input}
        placeholder="Enter tag number"
      />

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Enter name (optional)"
      />

      <Text style={styles.label}>Type *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={type}
          onValueChange={val => setType(val as Animal['type'])}
        >
          {['Cow', 'Buffalo', 'Goat', 'Sheep', 'Camel', 'Other'].map(t => (
            <Picker.Item key={t} label={t} value={t} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Gender *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={val => setGender(val as Animal['gender'])}
        >
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
      </View>

      <Text style={styles.label}>Birth Date * (YYYY-MM-DD)</Text>
      <TextInput
        value={birthDate}
        onChangeText={setBirthDate}
        style={styles.input}
        placeholder="2024-01-15"
      />

      <Text style={styles.label}>Breed</Text>
      <TextInput
        value={breed}
        onChangeText={setBreed}
        style={styles.input}
        placeholder="Enter breed (optional)"
      />

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        value={weight}
        onChangeText={setWeight}
        style={styles.input}
        placeholder="Enter weight (optional)"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        style={[styles.input, styles.textArea]}
        placeholder="Enter notes (optional)"
        multiline
        numberOfLines={4}
      />

      <View style={styles.buttonContainer}>
        <Button title="Pick Photo" onPress={pickImage} />
      </View>

      {image && (
        <View style={styles.imageContainer}>
          <Text style={styles.imageLabel}>Selected Image:</Text>
          <Image
            source={{ uri: image.uri }}
            style={styles.imagePreview}
          />
          <Button title="Remove Photo" onPress={clearImage} color="red" />
        </View>
      )}

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <Button title="Add Animal" onPress={handleSubmit} />
        )}
      </View>
    </ScrollView>
  );
};

export default AddAnimalScreen;

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  heading: {
    ...typography.h1,
    marginBottom: spacing.md,
    color: colors.text,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
    marginTop: spacing.sm,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    borderRadius: 8,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  imageContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  imageLabel: {
    marginBottom: 5,
    fontWeight: '600',
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginVertical: spacing.md,
  },
});