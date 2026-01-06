// src/components/charts/BarChart.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../config/theme';

export interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  title?: string;
  data: BarChartItem[];
}

const BarChart: React.FC<BarChartProps> = ({ title = 'Chart', data }) => {
  const max = data.reduce((m, item) => (item.value > m ? item.value : m), 0) || 1;

  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {data.map((item) => {
        const widthPercent = `${(item.value / max) * 100}%` as `${number}%`;
        return (
          <View key={item.label} style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.bar,
                  {
                    width: widthPercent,
                    backgroundColor: item.color || colors.primary,
                  } as any,
                ]}
              />
            </View>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default BarChart;

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    width: 80,
    ...typography.bodySmall,
    color: colors.text,
  },
  barBackground: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.sm,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 5,
  },
  value: {
    width: 40,
    textAlign: 'right',
    ...typography.bodySmall,
    color: colors.textLight,
  },
});


