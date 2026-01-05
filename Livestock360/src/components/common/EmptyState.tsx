// src/components/common/EmptyState.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';
import { colors, spacing, typography } from '../../config/theme';

interface EmptyStateProps {
  message?: string;
  onRetry?: () => void; // make onRetry optional
}

const EmptyState: React.FC<EmptyStateProps> = ({ message = 'No data available', onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {onRetry && (
        <Button
          title="Retry"
          onPress={onRetry}
          style={styles.retryButton}
        />
      )}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  text: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    marginTop: spacing.sm,
    width: 120,
  },
});
