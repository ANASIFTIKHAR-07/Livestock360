// src/components/animals/AnimalCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors, spacing, typography } from '../../config/theme';
import StatusBadge from '../common/StatusBadge';
import { shadows } from '../../config/theme';

export interface AnimalCardProps {
  tagNumber: string;
  name: string;
  type: string;
  status: 'Healthy' | 'Attention' | 'Critical' | 'Unknown';
  photo: string | undefined;  
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void; 
}

const AnimalCard: React.FC<AnimalCardProps> = ({ 
  tagNumber, 
  name, 
  type, 
  status, 
  photo, 
  onPress,
  onEdit,
  onDelete 
}) => {
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Animal',
      `Are you sure you want to delete ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: onDelete 
        }
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}
      
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.details}>{type} • {tagNumber}</Text>
        <View style={styles.statusContainer}>
          <StatusBadge status={status} />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {/* Edit Button */}
        {onEdit && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation(); // Prevent card onPress from firing
              onEdit();
            }}
          >
            <Icon name="edit-2" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}

        {/* Delete Button */}
        {onDelete && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation(); // Prevent card onPress from firing
              handleDelete();
            }}
          >
            <Icon name="trash-2" size={20} color="#F44336" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AnimalCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    ...shadows.md,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  placeholder: {
    backgroundColor: colors.grayLight,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.h3,
    color: colors.text,
  },
  details: {
    ...typography.body,
    color: colors.textLight,
    marginTop: 2,
  },
  statusContainer: {
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.xs,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});