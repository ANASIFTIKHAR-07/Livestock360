// src/components/common/Input.tsx
import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors, typography, spacing, dimensions } from '../../config/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string | null;
}

const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...props}
        style={[styles.input, style]}
        placeholderTextColor={colors.textLight}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    height: dimensions.inputHeight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: dimensions.cardBorderRadius,
    paddingHorizontal: spacing.md,
    color: colors.text,
    ...typography.body,
    backgroundColor: colors.surface,
  },
  error: {
    color: colors.error,
    ...typography.bodySmall,
    marginTop: spacing.xs,
  },
});
