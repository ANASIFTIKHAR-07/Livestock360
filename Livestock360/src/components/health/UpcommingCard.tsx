import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import { colors, spacing, typography } from '../../config/theme';
import { Animal } from '../../api/animal.api';
import { HealthRecord } from '../../api/health.api';

interface UpcomingCardProps {
  title: string;
  animal: Pick<Animal, '_id' | 'tagNumber' | 'name' | 'type' | 'photo'> | null;
  dueDate: string;
  daysUntil: number;
  type: HealthRecord['type'];
  status?: Animal['status'];
}

const UpcomingCard: React.FC<UpcomingCardProps> = ({ 
  title, 
  animal, 
  dueDate, 
  daysUntil, 
  type,
  status 
}) => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {status ? (
          <StatusBadge status={status} />
        ) : (
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{type}</Text>
          </View>
        )}
      </View>

      {animal ? (
        <Text style={styles.animal}>
          {animal.tagNumber} • {animal.name}
        </Text>
      ) : null}

      <Text style={styles.date}>
        Due: {new Date(dueDate).toDateString()}
      </Text>

      <Text
        style={[
          styles.days,
          daysUntil <= 3 && { color: colors.error },
        ]}
      >
        {daysUntil} days remaining
      </Text>
    </Card>
  );
};

export default UpcomingCard;

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
  animal: {
    ...typography.bodySmall,
    color: colors.text,
  },
  date: {
    ...typography.caption,
    color: colors.textLight,
  },
  days: {
    marginTop: spacing.xs,
    ...typography.bodySmall,
    color: colors.warning,
    fontWeight: '600',
  },
  typeBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.primary + '20',
    alignSelf: 'flex-start',
  },
  typeText: {
    color: colors.primary,
    ...typography.bodySmall,
    fontWeight: '600',
  },
});
