// src/screens/health/HealthRecordsScreen.tsx
import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import { HealthStackParamList } from '../../navigation/HealthNavigator';
import HealthRecordCard from '../../components/health/HealthRecordCard';
import LoadingSpinner from '../../components/common/LoadinSpinner';
import EmptyState from '../../components/common/EmptyState';
import { spacing, colors } from '../../config/theme';
import Icon from 'react-native-vector-icons/Feather';

const HealthRecordsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<HealthStackParamList>>();
  const { records, loading, error, refetch } = useHealthRecords();

  // ✅ Auto-refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 HealthRecords focused - refreshing...');
      refetch();
    }, [refetch])
  );

  const handleAddRecord = useCallback(() => {
    navigation.navigate('AddHealthRecord', {});
  }, [navigation]);

  if (loading && !records.length) {
    return (
      <View style={styles.centerContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Loading health records...</Text>
      </View>
    );
  }

  if (error && !records.length) {
    return (
      <View style={styles.container}>
        <EmptyState message={error} onRetry={refetch} />
        <TouchableOpacity style={styles.fab} onPress={handleAddRecord}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  if (!records.length) {
    return (
      <View style={styles.container}>
        <EmptyState 
          message="No health records found. Add your first record!" 
          onRetry={refetch}
        />
        <TouchableOpacity style={styles.fab} onPress={handleAddRecord}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        keyExtractor={(item) => item._id || item.title}
        renderItem={({ item }) => {
          if (!item || !item._id) {
            console.warn('⚠️ Skipping invalid health record:', item);
            return null;
          }

          // ✅ Build record object conditionally to satisfy exactOptionalPropertyTypes
          const record: any = {
            _id: item._id,
            title: item.title,
            type: item.type,
            status: item.status,
            date: item.date,
          };

          // Only add optional properties if they exist
          if (item.nextDueDate !== undefined) record.nextDueDate = item.nextDueDate;
          if (item.notes !== undefined) record.notes = item.notes;
          if (item.veterinarian !== undefined) record.veterinarian = item.veterinarian;
          if (item.medicine !== undefined) record.medicine = item.medicine;
          if (item.dosage !== undefined) record.dosage = item.dosage;
          if (item.cost !== undefined) record.cost = item.cost;

          return <HealthRecordCard record={record} />;
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={refetch}
      />
      
      {/* ✅ Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddRecord}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
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
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textLight,
    fontSize: 14,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});