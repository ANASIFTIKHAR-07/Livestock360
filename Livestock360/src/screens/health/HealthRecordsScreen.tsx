// src/screens/health/HealthRecordsScreen.tsx
import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import HealthRecordCard from '../../components/health/HealthRecordCard';
import LoadingSpinner from '../../components/common/LoadinSpinner';
import EmptyState from '../../components/common/EmptyState';
import { spacing, colors, typography } from '../../config/theme';

const HealthRecordsScreen: React.FC = () => {
  const { records, loading, error, refetch } = useHealthRecords();

  if (loading) {
    return (
      <LoadingSpinner>
        <Text>Loading health records...</Text>
      </LoadingSpinner>
    );
  }

  if (error) {
    return <EmptyState message={error} onRetry={refetch} />;
  }

  if (!records.length) {
    return <EmptyState message="No health records found." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Health Records</Text>
      <FlatList
        data={records}
        keyExtractor={(item) => item._id || item.title}
        renderItem={({ item }) => {
        //   const status = item.status === 'Completed' ? 'Healthy' : 'Attention';
          return (
            <HealthRecordCard
              record={{
                title: item.title,
                type: item.type,
                status: item.status, // just pass the raw backend status
                date: item.date,
                notes: item.notes ?? '',
              }}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default HealthRecordsScreen;

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


