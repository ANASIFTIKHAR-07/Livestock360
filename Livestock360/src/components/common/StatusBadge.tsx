// src/components/common/StatusBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../config/theme';

interface StatusBadgeProps {
  status: 'Healthy' | 'Attention' | 'Critical' | 'Unknown';
}

const statusColors: Record<string, string> = {
  Healthy: colors.success,
  Attention: colors.warning,
  Critical: colors.error,
  Unknown: colors.textLight,
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <View style={[styles.container, { backgroundColor: statusColors[status] }]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
};

export default StatusBadge;

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    color: colors.background,
    ...typography.bodySmall,
    fontWeight: '600',
  },
});
