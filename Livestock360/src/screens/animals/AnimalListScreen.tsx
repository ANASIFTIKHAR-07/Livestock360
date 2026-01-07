// src/screens/animals/AnimalListScreen.tsx
import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useAnimals } from '../../hooks/useAnimals';
import AnimalCard from '../../components/animals/AnimalCard';
import LoadingSpinner from '../../components/common/LoadinSpinner';
import EmptyState from '../../components/common/EmptyState';
import { spacing, colors } from '../../config/theme';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { AnimalsStackParamList } from '../../navigation/AnimalsNavigator';
import Icon from 'react-native-vector-icons/Feather';

const AnimalListScreen: React.FC = () => {
  const { animals, loading, error, refetch } = useAnimals();
  const navigation = useNavigation<NavigationProp<AnimalsStackParamList>>();

  // ✅ Auto-refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 AnimalList focused - refreshing animals...');
      refetch();
    }, [refetch])
  );

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

  const handleAddAnimal = useCallback(() => {
    navigation.navigate('AddAnimal');
  }, [navigation]);

  if (loading && !animals.length) {
    return (
      <View style={styles.centerContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Loading animals...</Text>
      </View>
    );
  }

  if (error && !animals.length) {
    return (
      <View style={styles.container}>
        <EmptyState message={error} onRetry={refetch} />
      </View>
    );
  }

  if (!animals.length) {
    return (
      <View style={styles.container}>
        <EmptyState 
          message="No animals found. Start by adding your first animal!" 
          onRetry={refetch}
        />
        <TouchableOpacity style={styles.fab} onPress={handleAddAnimal}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
            onDelete={refetch}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={refetch}
      />
      
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddAnimal}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default AnimalListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textLight,
    fontSize: 14,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});