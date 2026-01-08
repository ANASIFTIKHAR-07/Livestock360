// src/components/common/StatusBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../config/theme';

export type Status = 'Healthy' | 'Attention' | 'Critical' | 'Inactive' | 'Unknown';

interface StatusBadgeProps {
  status: Status;
}

const statusColors: Record<Status, string> = {
  Healthy: colors.success,
  Attention: colors.warning,
  Critical: colors.error,
  Inactive: colors.textLight,
  Unknown: colors.textLight,
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalizedStatus: Status = statusColors[status] ? status : 'Unknown';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: statusColors[normalizedStatus] },
      ]}
    >
      <Text style={styles.text}>{normalizedStatus}</Text>
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