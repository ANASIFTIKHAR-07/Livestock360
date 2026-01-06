// src/components/common/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { colors, typography, spacing, dimensions, shadows } from '../../config/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;  // ← Added this prop
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  disabled = false, 
  loading = false,  // ← Added this prop with default value
  style, 
  textStyle 
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}  // ← Disable when loading
      style={[
        styles.button,
        (disabled || loading) && styles.disabled,  // ← Apply disabled style when loading
        style
      ]}
    >
      {loading ? (  // ← Show spinner when loading
        <ActivityIndicator color={colors.background} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    height: dimensions.buttonHeight,
    backgroundColor: colors.primary,
    borderRadius: dimensions.cardBorderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    ...shadows.sm,
  },
  text: {
    color: colors.background,
    ...typography.button,
  },
  disabled: {
    backgroundColor: colors.border,
  },
});