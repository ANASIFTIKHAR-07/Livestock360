// src/config/theme.ts

// --------------------
// Colors
// --------------------
export const colors = {
    // Main Colors
    primary: '#059669',      // Fresh Green
    secondary: '#F97316',    // Alert Orange
  
    // Backgrounds
    background: '#FFFFFF',
    surface: '#F3F4F6',
  
    // Text
    text: '#1F2937',
    textLight: '#6B7280',
  
    // Status
    success: '#10B981',
    warning: '#FBBF24',
    error: '#EF4444',
    info: '#3B82F6',
  
    // Borders & Dividers
    border: '#E5E7EB',
    divider: '#D1D5DB',

    card: '#FFFFFF',   // card backgrounds
    grayLight: '#F3F4F6', // light gray for placeholders
    white: '#FFFFFF' // for buttons/text on primary
  } as const;
  
  // --------------------
  // Typography
  // --------------------
  export const typography = {
    h1: {
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 32,
      letterSpacing: -0.5
    },
    h2: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
      letterSpacing: -0.3
    },
    h3: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20
    },
    button: {
      fontSize: 18,
      fontWeight: '700',
      lineHeight: 24
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 18
    },
    bodyLarge: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
    },
  } as const;
  
  // --------------------
  // Spacing (8px system)
  // --------------------
  export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  } as const;
  
  // --------------------
  // Dimensions
  // --------------------
  export const dimensions = {
    // Touch targets
    buttonHeight: 56,
    buttonHeightSmall: 48,
    inputHeight: 52,
    touchTargetMin: 48,
  
    // Cards
    cardBorderRadius: 12,
    cardPadding: 16,
  
    // Icons
    iconSmall: 20,
    iconMedium: 24,
    iconLarge: 32,
  
    // Elevation
    elevationLow: 2,
    elevationMedium: 4,
    elevationHigh: 8
  } as const;
  
  // --------------------
  // Shadows
  // --------------------
  export const shadows = {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4
    }
  } as const;
  
  // --------------------
  // Health Status Mapping
  // --------------------
  export const healthStatus = {
    healthy: {
      color: colors.success,
      icon: 'check-circle',
      label: 'Healthy'
    },
    attention: {
      color: colors.warning,
      icon: 'alert-circle',
      label: 'Needs Attention'
    },
    critical: {
      color: colors.error,
      icon: 'x-circle',
      label: 'Critical'
    },
    unknown: {
      color: colors.textLight,
      icon: 'help-circle',
      label: 'Unknown'
    },
  } as const;
  