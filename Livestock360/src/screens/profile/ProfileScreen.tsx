// src/screens/profile/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { colors, spacing, typography } from '../../config/theme';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      {user ? (
        <>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user.fullName}</Text>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{user.userName}</Text>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </>
      ) : (
        <Text style={styles.value}>Not logged in</Text>
      )}
      <Button title="Logout" onPress={handleLogout} style={styles.button} />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  heading: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textLight,
    marginTop: spacing.sm,
  },
  value: {
    ...typography.body,
    color: colors.text,
  },
  button: {
    marginTop: spacing.xl,
  },
});
