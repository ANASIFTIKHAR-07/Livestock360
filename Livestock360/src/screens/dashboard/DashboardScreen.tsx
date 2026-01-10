// src/screens/dashboard/DashboardScreen.tsx

import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  useNavigation,
  CompositeNavigationProp,
} from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useDashboard } from '../../hooks/useDashboard';
import { DashboardOverview } from '../../api/dashboard.api';

import { colors, spacing } from '../../config/theme';

import Header from '../../components/layout/Header';
// import StatCard from '../../components/animals/AnimalStats';
import AlertCard from '../../components/health/UpcommingCard';
import LoadingSpinner from '../../components/common/LoadinSpinner';
import EmptyState from '../../components/common/EmptyState';

import { SafeAreaWrapper } from '../../components/layout/SafeAreaWrapper';

import type { MainTabParamList } from '../../navigation/MainNavigator';
import type { AnimalsStackParamList } from '../../navigation/AnimalsNavigator';

type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Dashboard'>,
  NativeStackNavigationProp<AnimalsStackParamList>
>;

const DashboardScreen = () => {
  const { data, loading, error, refetch } = useDashboard();
  const navigation = useNavigation<DashboardNavigationProp>();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (loading && !data) {
    return (
      <SafeAreaWrapper>
        <View style={styles.centerContainer}>
          <LoadingSpinner />
        </View>
      </SafeAreaWrapper>
    );
  }

  if (error && !data) {
    return (
      <SafeAreaWrapper>
        <View style={styles.centerContainer}>
          <EmptyState
            message={error || 'Failed to load dashboard'}
            onRetry={refetch}
          />
        </View>
      </SafeAreaWrapper>
    );
  }

  if (!data) {
    return (
      <SafeAreaWrapper>
        <View style={styles.centerContainer}>
          <EmptyState message="No data available" onRetry={refetch} />
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <Header
        title="Dashboard"
        rightContent={
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Animals', { screen: 'AddAnimal' })
            }
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        }
      />
      
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Quick Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your Livestock</Text>
          <Text style={styles.summaryNumber}>{data.animals.total}</Text>
          <Text style={styles.summarySubtitle}>Total Animals</Text>
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
              <Text style={styles.summaryLabel}>{data.animals.healthy} Healthy</Text>
            </View>
            {data.animals.needAttention > 0 && (
              <View style={styles.summaryItem}>
                <View style={[styles.statusDot, { backgroundColor: colors.warning }]} />
                <Text style={styles.summaryLabel}>{data.animals.needAttention} Need Care</Text>
              </View>
            )}
            {data.animals.critical > 0 && (
              <View style={styles.summaryItem}>
                <View style={[styles.statusDot, { backgroundColor: colors.error }]} />
                <Text style={styles.summaryLabel}>{data.animals.critical} Critical</Text>
              </View>
            )}
          </View>
        </View>

        {/* Urgent Alerts - Only show if there are items */}
        {data.upcomingVaccinations && data.upcomingVaccinations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⚠️ Upcoming Vaccinations</Text>
              <Text style={styles.sectionCount}>{data.upcomingVaccinations.length}</Text>
            </View>

            <View style={styles.alertsList}>
              {data.upcomingVaccinations.map(
                (item: DashboardOverview['upcomingVaccinations'][number]) => (
                  <AlertCard
                    key={item.id}
                    animal={item.animal}
                    type={item.type}
                    title={item.title}
                    dueDate={item.dueDate}
                    daysUntil={item.daysUntil}
                    status={item.status || item.animal?.status}
                  />
                ),
              )}
            </View>
          </View>
        )}

        {/* Stats Grid - Larger, easier to tap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Overview</Text>
          
          <View style={styles.statsGrid}>
            <TouchableOpacity style={styles.statCardLarge}>
              <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
                <Text style={styles.statEmoji}>🐄</Text>
              </View>
              <Text style={styles.statValue}>{data.animals.total}</Text>
              <Text style={styles.statLabel}>Total Animals</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statCardLarge}>
              <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
                <Text style={styles.statEmoji}>✅</Text>
              </View>
              <Text style={styles.statValue}>{data.animals.healthy}</Text>
              <Text style={styles.statLabel}>Healthy</Text>
            </TouchableOpacity>
          </View>

          {(data.animals.needAttention > 0 || data.animals.critical > 0) && (
            <View style={styles.statsGrid}>
              {data.animals.needAttention > 0 && (
                <TouchableOpacity style={styles.statCardLarge}>
                  <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
                    <Text style={styles.statEmoji}>⚠️</Text>
                  </View>
                  <Text style={styles.statValue}>{data.animals.needAttention}</Text>
                  <Text style={styles.statLabel}>Need Attention</Text>
                </TouchableOpacity>
              )}

              {data.animals.critical > 0 && (
                <TouchableOpacity style={styles.statCardLarge}>
                  <View style={[styles.statIcon, { backgroundColor: '#FFEBEE' }]}>
                    <Text style={styles.statEmoji}>🚨</Text>
                  </View>
                  <Text style={styles.statValue}>{data.animals.critical}</Text>
                  <Text style={styles.statLabel}>Critical</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Recent Activity - Simplified */}
        {data.recentActivity && data.recentActivity.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>

            <View style={styles.activityCard}>
              {data.recentActivity.slice(0, 5).map(
                (
                  item: DashboardOverview['recentActivity'][number],
                  index: number,
                ) => {
                  const isAnimal = item.type === 'animal_added';
                  const emoji = isAnimal ? '🐄' : '💉';
                  const title = isAnimal ? 'Added' : 'Health Record';
                  const detail = isAnimal
                    ? `${item.data?.name || 'Unknown'}`
                    : `${item.data?.recordType || 'Record'} - ${
                        item.data?.animal?.name || 'animal'
                      }`;

                  return (
                    <View key={index} style={styles.activityItem}>
                      <Text style={styles.activityEmoji}>{emoji}</Text>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>{title}</Text>
                        <Text style={styles.activityDetail}>{detail}</Text>
                      </View>
                      <Text style={styles.activityTime}>
                        {formatTime(item.timestamp)}
                      </Text>
                    </View>
                  );
                },
              )}
            </View>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

// Helper function for time formatting
const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },

  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 15,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.xs,
  },
  summaryNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  summarySubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.white,
    opacity: 0.2,
    marginVertical: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '500',
  },

  // Section
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  sectionCount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  // Alerts
  alertsList: {
    gap: spacing.sm,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statCardLarge: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
    justifyContent: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statEmoji: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Activity
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityEmoji: {
    fontSize: 24,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  activityDetail: {
    fontSize: 13,
    color: colors.textLight,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },

  bottomPadding: {
    height: spacing.xl,
  },
});