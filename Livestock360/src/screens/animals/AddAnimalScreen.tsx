// src/screens/animals/AddAnimalScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import EmptyState from '../../components/common/EmptyState';
import { spacing, colors, typography } from '../../config/theme';

const AddAnimalScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Animal</Text>
      <EmptyState message="Add animal form coming soon." />
    </View>
  );
};

export default AddAnimalScreen;

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


