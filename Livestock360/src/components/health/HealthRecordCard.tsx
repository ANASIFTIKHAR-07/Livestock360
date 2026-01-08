// src/components/health/HealthRecordCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import { colors, spacing, typography } from '../../config/theme';
import { formatDate } from '../../utils/dateHelpers';
import { mapHealthStatusToBadge } from '../../utils/statusMapping';
import { HealthStackParamList } from '../../navigation/HealthNavigator';
import Icon from 'react-native-vector-icons/Feather';

export interface HealthRecord {
  _id: string;
  title: string;
  type: string;
  status?: 'Completed' | 'Scheduled' | 'Overdue' | 'Cancelled' | undefined;
  date: string;
  nextDueDate?: string | undefined;
  notes?: string | undefined;
  veterinarian?: string | undefined;
  medicine?: string | undefined;
  dosage?: string | undefined;
  cost?: number | undefined;
}

interface HealthRecordCardProps {
  record: HealthRecord;
}

const HealthRecordCard: React.FC<HealthRecordCardProps> = ({ record }) => {
  const navigation = useNavigation<NavigationProp<HealthStackParamList>>();

  const handleEdit = () => {
    navigation.navigate('EditHealthRecord', { recordId: record._id });
  };

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{record.title}</Text>
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Icon name="edit-2" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <StatusBadge status={mapHealthStatusToBadge(record.status)} />
      </View>

      {/* Type Badge */}
      <View style={styles.typeBadge}>
        <Icon 
          name={getTypeIcon(record.type)} 
          size={14} 
          color={colors.primary} 
          style={styles.typeIcon}
        />
        <Text style={styles.type}>{record.type}</Text>
      </View>

      {/* Date Information */}
      <View style={styles.dateSection}>
        <View style={styles.dateRow}>
          <Icon name="calendar" size={14} color={colors.textLight} />
          <Text style={styles.dateLabel}>Date: </Text>
          <Text style={styles.date}>{formatDate(record.date)}</Text>
        </View>
        
        {record.nextDueDate && (
          <View style={styles.dateRow}>
            <Icon name="clock" size={14} color={colors.warning} />
            <Text style={styles.dateLabel}>Next Due: </Text>
            <Text style={[styles.date, styles.nextDueDate]}>
              {formatDate(record.nextDueDate)}
            </Text>
          </View>
        )}
      </View>

      {/* Additional Details */}
      {record.veterinarian && (
        <View style={styles.detailRow}>
          <Icon name="user" size={14} color={colors.textLight} />
          <Text style={styles.detailText}>Dr. {record.veterinarian}</Text>
        </View>
      )}

      {record.medicine && (
        <View style={styles.detailRow}>
          <Icon name="package" size={14} color={colors.textLight} />
          <Text style={styles.detailText}>
            {record.medicine}
            {record.dosage && ` - ${record.dosage}`}
          </Text>
        </View>
      )}

      {record.cost && (
        <View style={styles.detailRow}>
          <Icon name="dollar-sign" size={14} color={colors.textLight} />
          <Text style={styles.detailText}>Rs. {record.cost.toFixed(2)}</Text>
        </View>
      )}

      {record.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notes}>{record.notes}</Text>
        </View>
      )}
    </Card>
  );
};

// Helper function to get appropriate icon for health record type
const getTypeIcon = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'vaccination':
      return 'shield';
    case 'checkup':
      return 'activity';
    case 'treatment':
      return 'heart';
    case 'deworming':
      return 'droplet';
    case 'surgery':
      return 'scissors';
    default:
      return 'file-text';
  }
};

export default HealthRecordCard;

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
  },
  editButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    marginBottom: spacing.sm,
  },
  typeIcon: {
    marginRight: spacing.xs,
  },
  type: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  dateSection: {
    marginVertical: spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  dateLabel: {
    ...typography.caption,
    color: colors.textLight,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  date: {
    ...typography.caption,
    color: colors.text,
  },
  nextDueDate: {
    color: colors.warning,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailText: {
    ...typography.bodySmall,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  notesSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  notesLabel: {
    ...typography.bodySmall,
    color: colors.textLight,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  notes: {
    ...typography.bodySmall,
    color: colors.text,
    fontStyle: 'italic',
  },
});