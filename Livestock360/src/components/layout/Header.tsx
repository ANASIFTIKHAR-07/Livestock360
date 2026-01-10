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
      <View style={styles.leftSection}>
        {onBack ? (
          <TouchableOpacity 
            onPress={onBack} 
            style={styles.backButton} 
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        ) : (
          leftContent
        )}
      </View>

      {/* Center */}
      <View style={styles.centerSection}>
        {title && <Text style={styles.title} numberOfLines={1}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
      </View>

      {/* Right */}
      <View style={styles.rightSection}>{rightContent}</View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
    minHeight: 60,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    ...typography.h1,
    color: colors.text,
    fontWeight: '600',
    fontSize: 18,
  },
  subtitle: {
    ...typography.body,
    color: colors.textLight,
    marginTop: 2,
    textAlign: 'center',
    fontSize: 13,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
    paddingRight: spacing.sm,
    borderRadius: 8,
    gap: 4,
  },
  backIcon: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '500',
  },
  backText: {
    ...typography.button,
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
});