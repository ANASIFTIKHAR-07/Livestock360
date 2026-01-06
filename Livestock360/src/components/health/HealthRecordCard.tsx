// src/components/health/HealthRecordCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import { colors, spacing, typography } from '../../config/theme';
import { formatDate } from '../../utils/dateHelpers';

export interface HealthRecord {
  title: string;
  type: string;
  status?:"Healthy" | "Attention" | "Critical" | "Unknown";
  date: string;
  notes?: string;
}

interface HealthRecordCardProps {
  record: HealthRecord;
}

const HealthRecordCard: React.FC<HealthRecordCardProps> = ({ record }) => {
  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>{record.title}</Text>
        <StatusBadge status={record.status ?? 'Unknown'} />
      </View>

      <Text style={styles.type}>{record.type}</Text>
      <Text style={styles.date}>{formatDate(record.date)}</Text>

      {record.notes && (
        <Text style={styles.notes}>{record.notes}</Text>
      )}
    </Card>
  );
};

export default HealthRecordCard;


const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.text,
  },
  type: {
    ...typography.bodySmall,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.caption,
    color: colors.textLight,
  },
  notes: {
    marginTop: spacing.sm,
    ...typography.bodySmall,
    color: colors.text,
  },
});
