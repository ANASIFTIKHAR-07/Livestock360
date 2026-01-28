import React, { useEffect, useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import UpcomingCard from '../../components/health/UpcommingCard'; 
import LoadingSpinner from '../../components/common/LoadinSpinner';
import Header from '../../components/layout/Header';
import { spacing, colors } from '../../config/theme';

const UpcomingVaccinationsScreen = () => {
  const { upcomingRecords, loading, refetchUpcoming } = useHealthRecords();
  const [filterDays, setFilterDays] = useState(30);

  // Fetch upcoming records on mount and when filter changes
  useEffect(() => {
    refetchUpcoming(filterDays);
  }, [filterDays]);

  // Calculate stats
  const stats = useMemo(() => {
    const urgent = upcomingRecords.filter(r => {
      const days = r.daysUntilDue?.days || 0;
      return days <= 7;
    }).length;
    
    const thisWeek = upcomingRecords.filter(r => {
      const days = r.daysUntilDue?.days || 0;
      return days > 7 && days <= 14;
    }).length;
    
    const later = upcomingRecords.filter(r => {
      const days = r.daysUntilDue?.days || 0;
      return days > 14;
    }).length;

    return { total: upcomingRecords.length, urgent, thisWeek, later };
  }, [upcomingRecords]);

  if (loading && !upcomingRecords.length) {
    return (
      <View style={styles.container}>
        <Header title="Upcoming Vaccinations" />
        <View style={styles.centerContainer}>
          <LoadingSpinner />
          <Text style={styles.loadingText}>Loading vaccinations...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Upcoming Vaccinations" />

      {/* Stats Summary */}
      {upcomingRecords.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.error }]}>{stats.urgent}</Text>
              <Text style={styles.statLabel}>≤ 7 Days</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.warning }]}>{stats.thisWeek}</Text>
              <Text style={styles.statLabel}>8-14 Days</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.success }]}>{stats.later}</Text>
              <Text style={styles.statLabel}>15+ Days</Text>
            </View>
          </View>
        </View>
      )}

      {/* Filter Pills */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterLabel}>Show next:</Text>
        <TouchableOpacity
          style={[styles.filterPill, filterDays === 7 && styles.filterPillActive]}
          onPress={() => setFilterDays(7)}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterText, filterDays === 7 && styles.filterTextActive]}>
            7 days
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, filterDays === 14 && styles.filterPillActive]}
          onPress={() => setFilterDays(14)}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterText, filterDays === 14 && styles.filterTextActive]}>
            14 days
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, filterDays === 30 && styles.filterPillActive]}
          onPress={() => setFilterDays(30)}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterText, filterDays === 30 && styles.filterTextActive]}>
            30 days
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, filterDays === 90 && styles.filterPillActive]}
          onPress={() => setFilterDays(90)}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterText, filterDays === 90 && styles.filterTextActive]}>
            90 days
          </Text>
        </TouchableOpacity>
      </View>

      {/* Vaccinations List */}
      <FlatList
        data={upcomingRecords}
        keyExtractor={(item) => item._id || ''}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={() => refetchUpcoming(filterDays)}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptyMessage}>
              No vaccinations due in the next {filterDays} days
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const animalData = item.populatedAnimal || { 
            _id: item.animalId, 
            tagNumber: 'Unknown', 
            name: 'Unknown',
            type: 'Other' as const,
          };

          return (
            <View style={styles.cardWrapper}>
              <UpcomingCard
                animal={animalData}
                title={item.title}
                dueDate={item.nextDueDate || item.date}
                daysUntil={item.daysUntilDue?.days || 0}
                type={item.type}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default UpcomingVaccinationsScreen;

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
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },

  // Filters
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: spacing.xs,
  },
  filterPill: {
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

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
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
    lineHeight: 24,
  },
});