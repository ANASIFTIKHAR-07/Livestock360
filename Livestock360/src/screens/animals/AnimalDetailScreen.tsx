// src/screens/animals/AnimalDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import EmptyState from '../../components/common/EmptyState';
import { spacing, colors, typography } from '../../config/theme';

const AnimalDetailScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Animal Details</Text>
      <EmptyState message="Animal detail screen coming soon." />
    </View>
  );
};

export default AnimalDetailScreen;

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
});


