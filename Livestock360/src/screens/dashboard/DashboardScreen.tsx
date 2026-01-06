// src/screens/dashboard/DashboardScreen.tsx
import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useDashboard } from '../../hooks/useDashboard';
import { DashboardOverview } from '../../api/dashboard.api';
import { colors, typography, spacing } from '../../config/theme';
import StatCard from '../../components/animals/AnimalStats.tsx';
import AlertCard from '../../components/health/UpcommingCard';
import LoadingSpinner from '../../components/common/LoadinSpinner';
import EmptyState from '../../components/common/EmptyState';
import { SafeAreaWrapper } from '../../components/layout/SafeAreaWrapper';
import { KeyboardAvoidingWrapper } from '../../components/layout/KeyboardAvoidingWrapper';
import Button from '../../components/common/Button';

const DashboardScreen = () => {
  const { data, loading, error, refetch } = useDashboard();

  if (loading) {
    return (
      <SafeAreaWrapper>
        <LoadingSpinner>
          <Text>Loading dashboard...</Text>
        </LoadingSpinner>
      </SafeAreaWrapper>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaWrapper>
        <EmptyState
          message={error || 'Failed to load dashboard.'}
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
          {/* Stats Cards */}
          <Text style={styles.sectionTitle}>Animal Stats</Text>
          <View style={styles.statsRow}>
            <StatCard label="Total" value={data.animals.total} />
            <StatCard
              label="Healthy"
              value={data.animals.healthy}
              color={colors.success}
            />
            <StatCard
              label="Need Attention"
              value={data.animals.needAttention}
              color={colors.warning}
            />
            <StatCard
              label="Critical"
              value={data.animals.critical}
              color={colors.error}
            />
          </View>

          {/* Alerts */}
          <Text style={styles.sectionTitle}>Upcoming Vaccinations</Text>
          {data.upcomingVaccinations.length ? (
            data.upcomingVaccinations.map((item: DashboardOverview['upcomingVaccinations'][number]) => (
              <AlertCard
                key={item.id}
                animal={item.animal}
                type={item.type}
                title={item.title}
                dueDate={item.dueDate}
                daysUntil={item.daysUntil}
                status={item.status || item.animal?.status}
              />
            ))
          ) : (
            <EmptyState message="No upcoming vaccinations." />
          )}

          {/* Quick Action */}
          <Button
            title="Add Animal"
            onPress={() => {
              // Navigate to AddAnimalScreen
              // navigation.navigate('AddAnimal');
            }}
            style={styles.ctaButton}
          />

          {/* Recent Activity */}
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {data.recentActivity.length ? (
            data.recentActivity.map((item: DashboardOverview['recentActivity'][number], index: number) => {
              const isAnimal = item.type === 'animal_added';
              const title = isAnimal ? 'Animal added' : 'Health record added';
              const detail = isAnimal
                ? `${item.data?.name || 'Unknown'} (${item.data?.tagNumber || 'N/A'})`
                : `${item.data?.recordType || 'Record'} for ${item.data?.animal?.name || 'animal'}`;

              return (
                <View key={index} style={styles.activityCard}>
                  <Text style={styles.activityTitle}>{title}</Text>
                  <Text style={styles.activityDetail}>{detail}</Text>
                  <Text style={styles.activityTimestamp}>
                    {new Date(item.timestamp).toLocaleString()}
                  </Text>
                </View>
              );
            })
          ) : (
            <EmptyState message="No recent activity." />
          )}
        </ScrollView>
      </KeyboardAvoidingWrapper>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight as any,
    color: colors.text,
    marginVertical: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  ctaButton: {
    marginVertical: spacing.lg,
  },
  activityCard: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  activityTitle: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs / 2,
    fontWeight: '600',
  },
  activityDetail: {
    ...typography.bodySmall,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  activityTimestamp: {
    ...typography.caption,
    color: colors.textLight,
  },
});

export default DashboardScreen;
