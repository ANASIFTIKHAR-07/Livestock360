// src/screens/health/HealthRecordsScreen.tsx
import React, { useCallback, useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import { HealthStackParamList } from '../../navigation/HealthNavigator';
import HealthRecordCard from '../../components/health/HealthRecordCard';
import LoadingSpinner from '../../components/common/LoadinSpinner';
import EmptyState from '../../components/common/EmptyState';
import Header from '../../components/layout/Header';
import { spacing, colors } from '../../config/theme';
import Icon from 'react-native-vector-icons/Feather';

const HealthRecordsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<HealthStackParamList>>();
  const { records, loading, error, refetch } = useHealthRecords();
  
  // ALL HOOKS AT THE TOP
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Vaccination' | 'Treatment' | 'Checkup'>('all');

  useFocusEffect(
    useCallback(() => {
      console.log('🔄 HealthRecords focused - refreshing...');
      refetch();
    }, [refetch])
  );

  const handleAddRecord = useCallback(() => {
    navigation.navigate('AddHealthRecord', {});
  }, [navigation]);

  // Calculate stats
  const stats = useMemo(() => ({
    total: records.length,
    vaccination: records.filter(r => r.type === 'Vaccination').length,
    treatment: records.filter(r => r.type === 'Treatment').length,
    checkup: records.filter(r => r.type === 'Checkup').length,
  }), [records]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = !searchQuery || 
        record.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.notes?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'all' || record.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [records, searchQuery, filterType]);

  // Conditional rendering AFTER all hooks
  const isLoading = loading && !records.length;
  const hasError = error && !records.length;
  const isEmpty = !records.length;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Health Records" />
        <View style={styles.centerContainer}>
          <LoadingSpinner />
          <Text style={styles.loadingText}>Loading health records...</Text>
        </View>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.container}>
        <Header 
          title="Health Records"
          actionIcon="💉"
          actionLabel="Add Record"
          onActionPress={handleAddRecord}
        />
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
          title="Health Records"
          actionIcon="💉"
          actionLabel="Add Record"
          onActionPress={handleAddRecord}
        />
        <View style={styles.centerContainer}>
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyEmoji}>💉</Text>
            <Text style={styles.emptyTitle}>No Health Records Yet</Text>
            <Text style={styles.emptyMessage}>
              Start tracking vaccinations, treatments, and checkups for your animals
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleAddRecord}>
              <Text style={styles.emptyButtonText}>+ Add First Record</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Health Records"
        actionIcon="💉"
        actionLabel="Add Record"
        onActionPress={handleAddRecord}
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
            <Text style={[styles.statNumber, { color: colors.info }]}>{stats.vaccination}</Text>
            <Text style={styles.statLabel}>Vaccines</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.warning }]}>{stats.treatment}</Text>
            <Text style={styles.statLabel}>Treatments</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.success }]}>{stats.checkup}</Text>
            <Text style={styles.statLabel}>Checkups</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search records..."
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
          style={[styles.filterPill, filterType === 'all' && styles.filterPillActive]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[styles.filterText, filterType === 'all' && styles.filterTextActive]}>
            All ({stats.total})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, filterType === 'Vaccination' && styles.filterPillActive]}
          onPress={() => setFilterType('Vaccination')}
        >
          <Text style={[styles.filterText, filterType === 'Vaccination' && styles.filterTextActive]}>
            💉 Vaccines ({stats.vaccination})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, filterType === 'Treatment' && styles.filterPillActive]}
          onPress={() => setFilterType('Treatment')}
        >
          <Text style={[styles.filterText, filterType === 'Treatment' && styles.filterTextActive]}>
            💊 Treatments ({stats.treatment})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, filterType === 'Checkup' && styles.filterPillActive]}
          onPress={() => setFilterType('Checkup')}
        >
          <Text style={[styles.filterText, filterType === 'Checkup' && styles.filterTextActive]}>
            🩺 Checkups ({stats.checkup})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Records List */}
      <FlatList
        data={filteredRecords}
        keyExtractor={(item) => item._id || item.title}
        renderItem={({ item }) => {
          if (!item || !item._id) {
            console.warn('⚠️ Skipping invalid health record:', item);
            return null;
          }

          const record: any = {
            _id: item._id,
            title: item.title,
            type: item.type,
            status: item.status,
            date: item.date,
          };

          if (item.nextDueDate !== undefined) record.nextDueDate = item.nextDueDate;
          if (item.notes !== undefined) record.notes = item.notes;
          if (item.veterinarian !== undefined) record.veterinarian = item.veterinarian;
          if (item.medicine !== undefined) record.medicine = item.medicine;
          if (item.dosage !== undefined) record.dosage = item.dosage;
          if (item.cost !== undefined) record.cost = item.cost;

          return (
            <View style={styles.cardWrapper}>
              <HealthRecordCard record={record} />
            </View>
          );
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={refetch}
        ListEmptyComponent={
          <View style={styles.emptyFilterContainer}>
            <Text style={styles.emptyFilterEmoji}>🔍</Text>
            <Text style={styles.emptyFilterText}>No records match your search</Text>
            <TouchableOpacity onPress={() => { setSearchQuery(''); setFilterType('all'); }}>
              <Text style={styles.clearFiltersText}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default HealthRecordsScreen;

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
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
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