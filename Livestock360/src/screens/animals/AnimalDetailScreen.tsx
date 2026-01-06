// src/screens/animals/AnimalDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView, Image } from 'react-native';
import { spacing, colors, typography } from '../../config/theme';
import { getAnimalById, deleteAnimal, Animal } from '../../api/animal.api';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AnimalsStackParamList } from '../../navigation/AnimalsNavigator';

type AnimalDetailRouteProp = RouteProp<AnimalsStackParamList, 'AnimalDetail'>;

interface Props {
  refetchList?: () => void; // Optional refetch function from list screen
}

const AnimalDetailScreen: React.FC<Props> = ({ refetchList }) => {
  const route = useRoute<AnimalDetailRouteProp>();
  const navigation = useNavigation();
  const { animalId } = route.params; // ✅ Now works

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch animal details
  const fetchAnimal = async () => {
    setLoading(true);
    try {
      const res = await getAnimalById(animalId);
      setAnimal(res.data);
    } catch (err) {
      console.error('Failed to fetch animal:', err);
      Alert.alert('Error', 'Failed to load animal details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimal();
  }, [animalId]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Animal',
      'Are you sure you want to delete this animal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAnimal(animalId);
              Alert.alert('Deleted', 'Animal has been deleted.');
              if (refetchList) refetchList();
              navigation.goBack();
            } catch (err) {
              console.error('Failed to delete animal:', err);
              Alert.alert('Error', 'Failed to delete animal.');
            }
          },
        },
      ]
    );
  };

  if (loading || !animal) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{animal.name || 'Unnamed Animal'}</Text>

      {animal.photo && <Image source={{ uri: animal.photo }} style={styles.photo} />}

      <Text style={styles.label}>Tag Number:</Text>
      <Text style={styles.value}>{animal.tagNumber}</Text>

      <Text style={styles.label}>Type:</Text>
      <Text style={styles.value}>{animal.type}</Text>

      <Text style={styles.label}>Gender:</Text>
      <Text style={styles.value}>{animal.gender}</Text>

      {animal.breed && (
        <>
          <Text style={styles.label}>Breed:</Text>
          <Text style={styles.value}>{animal.breed}</Text>
        </>
      )}

      <Text style={styles.label}>Birth Date:</Text>
      <Text style={styles.value}>{new Date(animal.birthDate).toDateString()}</Text>

      {animal.weight && (
        <>
          <Text style={styles.label}>Weight:</Text>
          <Text style={styles.value}>{animal.weight} kg</Text>
        </>
      )}

      {animal.notes && (
        <>
          <Text style={styles.label}>Notes:</Text>
          <Text style={styles.value}>{animal.notes}</Text>
        </>
      )}

      <View style={{ marginTop: spacing.lg }}>
        <Button title="Delete Animal" onPress={handleDelete} color={colors.error} />
      </View>
    </ScrollView>
  );
};

export default AnimalDetailScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  heading: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body, // ✅ replaced subtitle
    marginTop: spacing.sm,
    color: colors.textLight,
  },
  value: {
    ...typography.body,
    marginBottom: spacing.sm,
    color: colors.text,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
});
