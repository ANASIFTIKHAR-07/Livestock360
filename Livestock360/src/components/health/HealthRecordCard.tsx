import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import { colors, spacing, typography } from '../../config/theme';

const HealthRecordCard = ({ record }) => {
  if (!record) return null;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{record.title}</Text>
        <StatusBadge status={record.status || 'unknown'} />
      </View>

      <Text style={styles.type}>{record.type}</Text>
      <Text style={styles.date}>
        Date: {new Date(record.date).toDateString()}
      </Text>

      {record.notes ? (
        <Text style={styles.notes}>{record.notes}</Text>
      ) : null}
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
