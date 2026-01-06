import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { colors, spacing, typography } from '../../config/theme';
import { isRequired, isEmail, minLength } from '../../utils/validators';

const RegisterScreen = () => {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!isRequired(fullName)) {
      Alert.alert('Error', 'Full name is required.');
      return;
    }
    if (!isRequired(userName) || !minLength(userName, 3)) {
      Alert.alert('Error', 'Username must be at least 3 characters.');
      return;
    }
    if (!isEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email.');
      return;
    }
    if (!isRequired(password) || !minLength(password, 8)) {
      Alert.alert('Error', 'Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await register({ fullName, userName, email, password });
      Alert.alert('Success', 'Registration successful!');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Create Account</Text>

        <Input
          label="Full Name"
          placeholder="John Doe"
          value={fullName}
          onChangeText={setFullName}
        />
        <Input
          label="Username"
          placeholder="johndoe"
          value={userName}
          onChangeText={setUserName}
        />
        <Input
          label="Email"
          placeholder="email@example.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Password"
          placeholder="********"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button
          title={loading ? 'Registering...' : 'Register'}
          onPress={handleRegister}
          disabled={loading}
          style={styles.button}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  heading: {
    ...typography.h1,
    marginBottom: spacing.lg,
    color: colors.text,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.lg,
  },
});
