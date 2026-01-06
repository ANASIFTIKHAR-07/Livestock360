// src/screens/dashboard/DashboardScreen.tsx

import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useDashboard } from '../../hooks/useDashboard';
import { DashboardOverview } from '../../api/dashboard.api';

import { colors, typography, spacing } from '../../config/theme';

import StatCard from '../../components/animals/AnimalStats';
import AlertCard from '../../components/health/UpcommingCard';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadinSpinner';
import EmptyState from '../../components/common/EmptyState';

import { SafeAreaWrapper } from '../../components/layout/SafeAreaWrapper';
import { KeyboardAvoidingWrapper } from '../../components/layout/KeyboardAvoidingWrapper';

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

  // --------------------
  // Loading
  // --------------------
  if (loading) {
    return (
      <SafeAreaWrapper>
        <LoadingSpinner />
      </SafeAreaWrapper>
    );
  }

  // --------------------
  // Error
  // --------------------
  if (error || !data) {
    return (
      <SafeAreaWrapper>
        <EmptyState
          message={error || 'Failed to load dashboard'}
          onRetry={refetch}
        />
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingWrapper>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >

          {/* ================= HEADER ================= */}
          <View style={styles.header}>
            <Text style={styles.greeting}>Welcome back 👋</Text>
            <Text style={styles.subGreeting}>
              Here’s a quick overview of your livestock
            </Text>
          </View>

          {/* ================= PRIMARY CTA ================= */}
          <Button
            title="➕ Add Animal"
            onPress={() => navigation.navigate('AddAnimal' as any)}
            style={styles.primaryCTA}
          />

          {/* ================= STATS ================= */}
          <Text style={styles.sectionTitle}>Animal Stats</Text>

          <View style={styles.statsGrid}>
            <StatCard label="Total" value={data.animals.total} />
            <StatCard
              label="Healthy"
              value={data.animals.healthy}
              color={colors.success}
            />
            <StatCard
              label="Needs Attention"
              value={data.animals.needAttention}
              color={colors.warning}
            />
            <StatCard
              label="Critical"
              value={data.animals.critical}
              color={colors.error}
            />
          </View>

          {/* ================= UPCOMING VACCINATIONS ================= */}
          <Text style={styles.sectionTitle}>Upcoming Vaccinations</Text>

          {data.upcomingVaccinations.length > 0 ? (
            data.upcomingVaccinations.map(
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
              )
            )
          ) : (
            <View style={styles.softEmpty}>
              <Text style={styles.softEmptyText}>
                🎉 No upcoming vaccinations
              </Text>
            </View>
          )}

          {/* ================= RECENT ACTIVITY ================= */}
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          {data.recentActivity.length > 0 ? (
            data.recentActivity.map(
              (
                item: DashboardOverview['recentActivity'][number],
                index: number
              ) => {
                const isAnimal = item.type === 'animal_added';
                const title = isAnimal
                  ? 'Animal added'
                  : 'Health record added';

                const detail = isAnimal
                  ? `${item.data?.name || 'Unknown'} (${item.data?.tagNumber || 'N/A'})`
                  : `${item.data?.recordType || 'Record'} for ${item.data?.animal?.name || 'animal'}`;

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
              }
            )
          ) : (
            <View style={styles.softEmpty}>
              <Text style={styles.softEmptyText}>
                No recent activity yet
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingWrapper>
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
  },

  header: {
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 22,
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

  sectionTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  softEmpty: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  softEmptyText: {
    fontSize: 14,
    color: colors.textLight,
  },

  activityItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
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
});
