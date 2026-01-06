import React from 'react';
import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({ children, style }) => {
  return <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>;
};

export { SafeAreaWrapper };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

