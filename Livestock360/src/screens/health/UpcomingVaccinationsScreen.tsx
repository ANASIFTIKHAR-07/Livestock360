import React, { useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import UpcomingCard from '../../components/health/UpcommingCard'; 
import LoadingSpinner from '../../components/common/LoadinSpinner';
import EmptyState from '../../components/common/EmptyState';
import { SafeAreaWrapper } from '../../components/layout/SafeAreaWrapper';
import { spacing } from '../../config/theme';

const UpcomingVaccinationsScreen = () => {
  const { upcomingRecords, loading, refetchUpcoming } = useHealthRecords();

  // Fetch upcoming records on mount
  useEffect(() => {
    refetchUpcoming(30); // Get records due in next 30 days
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaWrapper>
      <FlatList
        data={upcomingRecords}
        keyExtractor={(item) => item._id || ''}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={() => refetchUpcoming(30)}
        ListEmptyComponent={<EmptyState message="No upcoming vaccinations" />}
        renderItem={({ item }) => {
          // Provide a fallback animal object if populatedAnimal is missing
          const animalData = item.populatedAnimal || { 
            _id: item.animalId, 
            tagNumber: 'Unknown', 
            name: 'Unknown',
            type: 'Other' as const,
          };

          return (
            <UpcomingCard
              animal={animalData}
              title={item.title}
              dueDate={item.nextDueDate || item.date}
              daysUntil={item.daysUntilDue?.days || 0}
              type={item.type}
            />
          );
        }}
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: spacing.md,
  },
});

export default UpcomingVaccinationsScreen;