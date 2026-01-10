import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, spacing, typography, shadows } from '../../config/theme';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'minimal';
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  leftContent,
  rightContent,
  style,
  variant = 'default',
}) => {
  const isMinimal = variant === 'minimal';

  return (
    <View style={[styles.container, isMinimal && styles.containerMinimal, style]}>
      <View style={styles.content}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {onBack ? (
            <TouchableOpacity 
              onPress={onBack} 
              style={styles.backButton} 
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.6}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          ) : (
            leftContent
          )}
        </View>

        {/* Center Section */}
        <View style={styles.centerSection}>
          {title && (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          )}
          {subtitle && !isMinimal && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {rightContent}
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: spacing.md,
  },
  containerMinimal: {
    borderBottomWidth: 0,
    backgroundColor: colors.background,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    minHeight: 56,
  },
  leftSection: {
    minWidth: 48,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: spacing.sm,
  },
  rightSection: {
    minWidth: 48,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
    fontWeight: '400',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  backIcon: {
    fontSize: 24,
    color: colors.text,
    fontWeight: '600',
  },
});