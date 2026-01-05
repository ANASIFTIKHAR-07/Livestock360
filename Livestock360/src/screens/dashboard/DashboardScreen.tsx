// src/screens/dashboard/DashboardScreen.tsx
import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useDashboard } from '../../hooks/useDashboad';
import { colors, typography, spacing } from '../../config/theme';
import StatCard from '../../components/animals/AnimalStats';
import AlertCard from '../../components/health/UpcomingCard';
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
            data.upcomingVaccinations.map(item => (
              <AlertCard
                key={item.id}
                animal={item.animal}
                type={item.type}
                title={item.title}
                dueDate={item.dueDate}
                daysUntil={item.daysUntil}
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
            data.recentActivity.map((item, index) => (
              <AlertCard
                key={index}
                type={item.type}
                data={item.data}
                timestamp={item.timestamp}
              />
            ))
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
});

export default DashboardScreen;
