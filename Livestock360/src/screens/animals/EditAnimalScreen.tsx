import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { AnimalsStackParamList } from '../../navigation/AnimalsNavigator';
import { useAnimals } from '../../hooks/useAnimals';
import { Animal } from '../../api/animal.api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { SafeAreaWrapper } from '../../components/layout/SafeAreaWrapper';
import { spacing } from '../../config/theme';

type RouteProps = RouteProp<AnimalsStackParamList, 'EditAnimal'>;

// Create a form interface that matches our needs
interface AnimalForm {
  tagNumber: string;
  name: string;
  type: string;
  breed: string;
  gender: string;
  weight: string;
  status: string;
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
  }, [animalId]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Build update data object dynamically to satisfy exactOptionalPropertyTypes
      const updateData: Record<string, any> = {};

      // Only add properties that have values
      if (form.tagNumber) updateData.tagNumber = form.tagNumber;
      if (form.name) updateData.name = form.name;
      if (form.type) updateData.type = form.type;
      if (form.breed) updateData.breed = form.breed;
      if (form.gender) updateData.gender = form.gender;
      if (form.status) updateData.status = form.status;
      if (form.notes) updateData.notes = form.notes;
      if (form.weight) updateData.weight = Number(form.weight);

      await updateAnimal(animalId, updateData as Partial<Animal>);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to update animal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <ScrollView contentContainerStyle={styles.container}>
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
        <Input 
          label="Notes" 
          value={form.notes} 
          onChangeText={(v) => setForm({ ...form, notes: v })} 
        />

        <Button title="Update Animal" loading={loading} onPress={handleSubmit} />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
});

export default EditAnimalScreen;