// src/context/ThemeContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import {
  colors,
  typography,
  spacing,
  dimensions,
  shadows,
  healthStatus,
} from '../config/theme';

// --------------------
// Theme Type
// --------------------
export interface Theme {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  dimensions: typeof dimensions;
  shadows: typeof shadows;
  healthStatus: typeof healthStatus;
}

// Context value type
export interface ThemeContextValue {
  theme: Theme;
}

// --------------------
// Create Context
// --------------------
const ThemeContext = createContext<ThemeContextValue>({
  theme: {
    colors,
    typography,
    spacing,
    dimensions,
    shadows,
    healthStatus,
  },
});

// --------------------
// Provider Component
// --------------------
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider
      value={{
        theme: {
          colors,
          typography,
          spacing,
          dimensions,
          shadows,
          healthStatus,
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// --------------------
// Custom Hook
// --------------------
export const useTheme = (): ThemeContextValue => {
  return useContext(ThemeContext);
};
