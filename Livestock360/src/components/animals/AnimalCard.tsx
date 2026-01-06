// src/components/animals/AnimalCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
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
}

const AnimalCard: React.FC<AnimalCardProps> = ({ tagNumber, name, type, status, photo, onPress }) => {
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
      </View>
      <StatusBadge status={status} />
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
});
