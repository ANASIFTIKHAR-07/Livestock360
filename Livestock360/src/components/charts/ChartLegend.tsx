// src/components/charts/ChartLegend.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../../config/theme';

export interface LegendItem {
  label: string;
  color: string;
  value?: number;
}

interface ChartLegendProps {
  items: LegendItem[];
  style?: ViewStyle;
}

const ChartLegend: React.FC<ChartLegendProps> = ({ items, style }) => {
  return (
    <View style={[styles.container, style]}>
      {items.map((item) => (
        <View key={item.label} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={styles.label}>{item.label}</Text>
          {typeof item.value === 'number' && (
            <Text style={styles.value}>{item.value}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

export default ChartLegend;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  label: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.text,
  },
  value: {
    ...typography.bodySmall,
    color: colors.textLight,
  },
});


