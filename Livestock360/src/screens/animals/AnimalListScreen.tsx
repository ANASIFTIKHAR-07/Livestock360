// src/screens/animals/AnimalListScreen.tsx
import React, { useCallback, useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { useAnimals } from '../../hooks/useAnimals';
import AnimalCard from '../../components/animals/AnimalCard';
import LoadingSpinner from '../../components/common/LoadinSpinner';
import EmptyState from '../../components/common/EmptyState';
import Header from '../../components/layout/Header';
import { spacing, colors } from '../../config/theme';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { AnimalsStackParamList } from '../../navigation/AnimalsNavigator';
import Icon from 'react-native-vector-icons/Feather';

const AnimalListScreen: React.FC = () => {
  const { animals, loading, error, refetch } = useAnimals();
  const navigation = useNavigation<NavigationProp<AnimalsStackParamList>>();
  
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL RETURNS
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'healthy' | 'attention' | 'critical'>('all');

  // Auto-refresh when screen comes into focus
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

  // Calculate stats using useMemo
  const stats = useMemo(() => ({
    total: animals.length,
    healthy: animals.filter(a => a.status === 'Healthy').length,
    attention: animals.filter(a => a.status === 'Attention').length,
    critical: animals.filter(a => a.status === 'Critical').length,
  }), [animals]);

  // Filter animals using useMemo
  const filteredAnimals = useMemo(() => {
    return animals.filter(animal => {
      const matchesSearch = !searchQuery || 
        animal.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.tagNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'healthy' && animal.status === 'Healthy') ||
        (filterStatus === 'attention' && animal.status === 'Attention') ||
        (filterStatus === 'critical' && animal.status === 'Critical');

      return matchesSearch && matchesStatus;
    });
  }, [animals, searchQuery, filterStatus]);

  // NOW we can do conditional rendering AFTER all hooks
  const isLoading = loading && !animals.length;
  const hasError = error && !animals.length;
  const isEmpty = !animals.length;

  if (isLoading) {
    return (
      <View style={styles.container}>
        {/* <Header title="My Animals" /> */}
        <View style={styles.centerContainer}>
          <LoadingSpinner />
          <Text style={styles.loadingText}>Loading animals...</Text>
        </View>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.container}>
        <Header title="My Animals" />
        <View style={styles.centerContainer}>
          <EmptyState message={error} onRetry={refetch} />
        </View>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={styles.container}>
        <Header 
          title="My Animals"
          actionIcon="🐄"
          actionLabel="Add Animal"
          onActionPress={handleAddAnimal}
        />
        <View style={styles.centerContainer}>
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyEmoji}>🐄</Text>
            <Text style={styles.emptyTitle}>No Animals Yet</Text>
            <Text style={styles.emptyMessage}>
              Start managing your livestock by adding your first animal
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleAddAnimal}>
              <Text style={styles.emptyButtonText}>+ Add Your First Animal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="My Animals"
        actionIcon="🐄"
        actionLabel="Add Animal"
        onActionPress={handleAddAnimal}
      />

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.success }]}>{stats.healthy}</Text>
            <Text style={styles.statLabel}>Healthy</Text>
          </View>
          {stats.attention > 0 && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.warning }]}>{stats.attention}</Text>
                <Text style={styles.statLabel}>Attention</Text>
              </View>
            </>
          )}
          {stats.critical > 0 && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.error }]}>{stats.critical}</Text>
                <Text style={styles.statLabel}>Critical</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or tag number..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textLight}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="x" size={20} color={colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Pills */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterPill, filterStatus === 'all' && styles.filterPillActive]}
          onPress={() => setFilterStatus('all')}
        >
          <Text style={[styles.filterText, filterStatus === 'all' && styles.filterTextActive]}>
            All ({stats.total})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, filterStatus === 'healthy' && styles.filterPillActive]}
          onPress={() => setFilterStatus('healthy')}
        >
          <View style={[styles.filterDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.filterText, filterStatus === 'healthy' && styles.filterTextActive]}>
            Healthy ({stats.healthy})
          </Text>
        </TouchableOpacity>
        {stats.attention > 0 && (
          <TouchableOpacity
            style={[styles.filterPill, filterStatus === 'attention' && styles.filterPillActive]}
            onPress={() => setFilterStatus('attention')}
          >
            <View style={[styles.filterDot, { backgroundColor: colors.warning }]} />
            <Text style={[styles.filterText, filterStatus === 'attention' && styles.filterTextActive]}>
              Attention ({stats.attention})
            </Text>
          </TouchableOpacity>
        )}
        {stats.critical > 0 && (
          <TouchableOpacity
            style={[styles.filterPill, filterStatus === 'critical' && styles.filterPillActive]}
            onPress={() => setFilterStatus('critical')}
          >
            <View style={[styles.filterDot, { backgroundColor: colors.error }]} />
            <Text style={[styles.filterText, filterStatus === 'critical' && styles.filterTextActive]}>
              Critical ({stats.critical})
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Animal List */}
      <FlatList
        data={filteredAnimals}
        keyExtractor={item => item._id || item.tagNumber}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
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
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={refetch}
        ListEmptyComponent={
          <View style={styles.emptyFilterContainer}>
            <Text style={styles.emptyFilterEmoji}>🔍</Text>
            <Text style={styles.emptyFilterText}>No animals match your search</Text>
            <TouchableOpacity onPress={() => { setSearchQuery(''); setFilterStatus('all'); }}>
              <Text style={styles.clearFiltersText}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    padding: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textLight,
    fontSize: 14,
  },

  // Empty State
  emptyStateContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },

  // Stats
  statsContainer: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 0,
  },

  // Filters
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterTextActive: {
    color: colors.white,
  },

  // List
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  cardWrapper: {
    marginBottom: spacing.md,
  },

  // Empty Filter State
  emptyFilterContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyFilterEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyFilterText: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: spacing.sm,
  },
  clearFiltersText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});