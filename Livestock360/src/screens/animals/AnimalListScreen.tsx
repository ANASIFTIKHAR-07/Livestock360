// src/screens/animals/AnimalListScreen.tsx
import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useAnimals } from '../../hooks/useAnimals';
import AnimalCard from '../../components/animals/AnimalCard';
import LoadingSpinner from '../../components/common/LoadinSpinner';
import EmptyState from '../../components/common/EmptyState';
import { spacing, colors, typography } from '../../config/theme';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AnimalsStackParamList } from '../../navigation/AnimalsNavigator';

const AnimalListScreen: React.FC = () => {
  const { animals, loading, error, refetch } = useAnimals();
  const navigation = useNavigation<NavigationProp<AnimalsStackParamList>>();

  const handleAnimalPress = useCallback(
    (id: string) => {
      navigation.navigate('AnimalDetail', { animalId: id });
    },
    [navigation],
  );

  const handleAnimalEdit = useCallback(
    (id: string) => {
      navigation.navigate('EditAnimal', { animalId: id });
    },
    [navigation],
  );

  if (loading) {
    return (
      <LoadingSpinner>
        <Text>Loading animals...</Text>
      </LoadingSpinner>
    );
  }

  if (error) {
    return <EmptyState message={error} onRetry={refetch} />;
  }

  if (!animals.length) {
    return <EmptyState message="No animals found." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Animals</Text>
      <FlatList
        data={animals}
        keyExtractor={item => item._id || item.tagNumber}
        renderItem={({ item }) => (
          <AnimalCard
            tagNumber={item.tagNumber}
            name={item.name || 'Unnamed'}
            type={item.type}
            status={item.status || 'Unknown'}
            photo={item.photo}
            onPress={() => handleAnimalPress(item._id!)}
            onEdit={() => handleAnimalEdit(item._id!)}
            onDelete={refetch} // optionally refresh after deletion
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default AnimalListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  heading: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
});
