import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // ✅ Correct Picker import
import { spacing, colors, typography } from '../../config/theme';
import { createAnimal, CreateAnimalPayload, Animal } from '../../api/animal.api';
import { useNavigation } from '@react-navigation/native';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useAuth } from '../../context/AuthContext'; // To get current user ID

const AddAnimalScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { image, pickImage } = useImagePicker();

  const [tagNumber, setTagNumber] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<Animal['type']>('Cow');
  const [gender, setGender] = useState<Animal['gender']>('Male');

  const handleSubmit = async () => {
    if (!user || !user._id) {
      console.error("No user ID found");
      return;
    }
  

    const payload: CreateAnimalPayload = {
      tagNumber,
      name,
      type,
      gender,
      userId: user._id, // ✅ Use actual user ID
      birthDate: new Date().toISOString(),
    };

    try {
      await createAnimal(payload, image ? (image as unknown as File) : undefined);
      navigation.goBack();
    } catch (err) {
      console.error('Failed to create animal:', err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add Animal</Text>

      <Text>Tag Number</Text>
      <TextInput
        value={tagNumber}
        onChangeText={setTagNumber}
        style={styles.input}
        placeholder="Enter tag number"
      />

      <Text>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Enter name (optional)"
      />

      <Text>Type</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={type} onValueChange={(val) => setType(val as Animal['type'])}>
          {['Cow', 'Buffalo', 'Goat', 'Sheep', 'Camel', 'Other'].map((t) => (
            <Picker.Item key={t} label={t} value={t} />
          ))}
        </Picker>
      </View>

      <Text>Gender</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={gender} onValueChange={(val) => setGender(val as Animal['gender'])}>
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
      </View>

      <Button title="Pick Photo" onPress={pickImage} />
      {image && <Text>Selected: {image.uri}</Text>}

      <Button title="Add Animal" onPress={handleSubmit} />
    </ScrollView>
  );
};

export default AddAnimalScreen;

const styles = StyleSheet.create({
  container: { padding: spacing.md, backgroundColor: colors.background },
  heading: { ...typography.h1, marginBottom: spacing.md },
  input: { borderWidth: 1, borderColor: colors.border, padding: 8, marginBottom: spacing.sm },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
});
