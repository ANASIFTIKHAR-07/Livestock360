// src/components/charts/PieChart.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../config/theme';

export interface PieChartSegment {
  label: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  title?: string;
  data: PieChartSegment[];
}

const PieChart: React.FC<PieChartProps> = ({ title = 'Distribution', data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {/* Placeholder for actual chart implementation */}
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Pie chart coming soon</Text>
      </View>
      <View>
        {data.map((item) => {
          const percentage = total ? Math.round((item.value / total) * 100) : 0;
          return (
            <View key={item.label} style={styles.row}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: item.color || colors.primary },
                ]}
              />
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>
                {item.value} ({percentage}%)
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default PieChart;

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  placeholder: {
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  placeholderText: {
    ...typography.caption,
    color: colors.textLight,
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


