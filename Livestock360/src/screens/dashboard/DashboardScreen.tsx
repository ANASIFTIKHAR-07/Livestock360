// src/screens/dashboard/DashboardScreen.tsx

import React from 'react';
import { View, ScrollView, Text, StyleSheet, RefreshControl } from 'react-native';
import {
  useNavigation,
  CompositeNavigationProp,
} from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useDashboard } from '../../hooks/useDashboard';
import { DashboardOverview } from '../../api/dashboard.api';

import { colors, spacing } from '../../config/theme';

import StatCard from '../../components/animals/AnimalStats';
import AlertCard from '../../components/health/UpcommingCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadinSpinner';
import EmptyState from '../../components/common/EmptyState';

import { SafeAreaWrapper } from '../../components/layout/SafeAreaWrapper';

import type { MainTabParamList } from '../../navigation/MainNavigator';
import type { AnimalsStackParamList } from '../../navigation/AnimalsNavigator';

// --------------------
// Navigation Type
// --------------------
type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Dashboard'>,
  NativeStackNavigationProp<AnimalsStackParamList>
>;

const DashboardScreen = () => {
  const { data, loading, error, refetch } = useDashboard();
  const navigation = useNavigation<DashboardNavigationProp>();
  
  // IMPORTANT: All hooks must be called before any conditional returns
  const [refreshing, setRefreshing] = React.useState(false);

  // --------------------
  // Pull to Refresh
  // --------------------
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // --------------------
  // Loading
  // --------------------
  if (loading && !data) {
    return (
      <SafeAreaWrapper>
        <View style={styles.centerContainer}>
          <LoadingSpinner />
        </View>
      </SafeAreaWrapper>
    );
  }

  // --------------------
  // Error
  // --------------------
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
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back 👋</Text>
          <Text style={styles.subGreeting}>
            Here's a quick overview of your livestock
          </Text>
        </View>

        {/* ================= PRIMARY CTA ================= */}
        <Button
          title="➕ Add Animal"
          onPress={() =>
            navigation.navigate('Animals', { screen: 'AddAnimal' })
          }
          style={styles.primaryCTA}
        />

        {/* ================= STATS ================= */}
        <Text style={styles.sectionTitle}>Animal Stats</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <StatCard 
                label="Total" 
                value={data.animals.total}
              />
            </View>
            <View style={styles.statCard}>
              <StatCard
                label="Healthy"
                value={data.animals.healthy}
                color={colors.success}
              />
            </View>
          </View>
          
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <StatCard
                label="Needs Attention"
                value={data.animals.needAttention}
                color={colors.warning}
              />
            </View>
            <View style={styles.statCard}>
              <StatCard
                label="Critical"
                value={data.animals.critical}
                color={colors.error}
              />
            </View>
          </View>
        </View>

        {/* ================= UPCOMING VACCINATIONS ================= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Vaccinations</Text>

          {data.upcomingVaccinations && data.upcomingVaccinations.length > 0 ? (
            <View style={styles.vaccinationList}>
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
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                🎉 No upcoming vaccinations
              </Text>
            </View>
          )}
        </View>

        {/* ================= RECENT ACTIVITY ================= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          {data.recentActivity && data.recentActivity.length > 0 ? (
            <View style={styles.activityList}>
              {data.recentActivity.map(
                (
                  item: DashboardOverview['recentActivity'][number],
                  index: number,
                ) => {
                  const isAnimal = item.type === 'animal_added';
                  const title = isAnimal ? 'Animal added' : 'Health record added';

                  const detail = isAnimal
                    ? `${item.data?.name || 'Unknown'} (${
                        item.data?.tagNumber || 'N/A'
                      })`
                    : `${item.data?.recordType || 'Record'} for ${
                        item.data?.animal?.name || 'animal'
                      }`;

                  return (
                    <View key={index} style={styles.activityItem}>
                      <View style={styles.activityDot} />
                      <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>{title}</Text>
                        <Text style={styles.activityDetail}>{detail}</Text>
                        <Text style={styles.activityTime}>
                          {new Date(item.timestamp).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  );
                },
              )}
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No recent activity yet</Text>
            </View>
          )}
        </View>

        {/* Bottom padding for safe area */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default DashboardScreen;

// =====================
// Styles
// =====================
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

  header: {
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subGreeting: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textLight,
  },

  primaryCTA: {
    marginBottom: spacing.lg,
  },

  section: {
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },

  // Stats Grid - 2x2 layout
  statsGrid: {
    marginBottom: spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  statCard: {
    flex: 1,
    marginHorizontal: spacing.xs / 2,
  },

  // Vaccination List
  vaccinationList: {
    gap: spacing.sm,
  },

  // Activity List
  activityList: {
    gap: spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: spacing.sm,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  activityDetail: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },

  // Empty States
  emptyBox: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },

  bottomPadding: {
    height: spacing.xl,
  },
});