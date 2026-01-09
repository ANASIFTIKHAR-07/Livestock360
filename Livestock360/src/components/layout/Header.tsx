import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, spacing, typography, shadows, dimensions } from '../../config/theme';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  leftContent,
  rightContent,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Left */}
      <View style={styles.side}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton} hitSlop={8}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
        )}
        {!onBack && leftContent}
      </View>

      {/* Center */}
      <View style={styles.center}>
        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Right */}
      <View style={styles.side}>{rightContent}</View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textLight,
    marginTop: 2,
    textAlign: 'center',
  },
  backButton: {
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dimensions.cardBorderRadius,
  },
  backText: {
    ...typography.button,
    color: colors.primary,
  },
});
