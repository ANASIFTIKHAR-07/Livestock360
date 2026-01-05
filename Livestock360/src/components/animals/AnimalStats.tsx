// src/components/animals/AnimalStats.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../config/theme';

interface StatCardProps {
  label: string;
  value: number;
  color?: string;
}

const AnimalStats: React.FC<StatCardProps> = ({ label, value, color = colors.text }) => {
  return (
    <View style={[styles.card, { borderColor: color }]}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default AnimalStats;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 80,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    margin: spacing.xs / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.body,
    color: colors.textLight,
  },
});
