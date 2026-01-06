// src/screens/animals/AnimalListScreen.tsx
import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useAnimals } from '../../hooks/useAnimals';
import AnimalCard from '../../components/animals/AnimalCard';
import LoadingSpinner from '../../components/common/LoadinSpinner';
import EmptyState from '../../components/common/EmptyState';
import { spacing, colors, typography } from '../../config/theme';

const AnimalListScreen: React.FC = () => {
  const { animals, loading, error, refetch } = useAnimals();

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
        keyExtractor={(item) => item._id || item.tagNumber}
        renderItem={({ item }) => (
          <AnimalCard
            tagNumber={item.tagNumber}
            name={item.name || 'Unnamed'}
            type={item.type}
            status={item.status || 'Unknown'}
            photo={item.photo}
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


