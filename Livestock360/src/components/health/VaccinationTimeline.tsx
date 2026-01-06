import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, typography, colors } from '../../config/theme';
import { HealthRecord } from '../../api/health.api';
import { formatDate } from '../../utils/dateHelpers';

type TimelineItem = Pick<HealthRecord, 'title' | 'nextDueDate'> & {
  dueDate?: string; // legacy fallback
};

interface VaccinationTimelineProps {
  items?: TimelineItem[];
}

const VaccinationTimeline: React.FC<VaccinationTimelineProps> = ({ items = [] }) => {
  if (!items.length) {
    return (
      <Text style={styles.empty}>No upcoming vaccinations</Text>
    );
  }

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.dot} />
          <View style={styles.content}>
            <Text style={styles.title}>{item.title || 'Vaccination'}</Text>
            <Text style={styles.date}>{formatDate(item.nextDueDate || item.dueDate)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default VaccinationTimeline;

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: spacing.xs,
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.body,
    color: colors.text,
  },
  date: {
    ...typography.caption,
    color: colors.textLight,
  },
  empty: {
    textAlign: 'center',
    color: colors.textLight,
    ...typography.bodySmall,
  },
});
