// src/components/common/LoadingSpinner.tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing } from '../../config/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  children?: React.ReactNode
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'large', color = colors.primary }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default LoadingSpinner;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
});
