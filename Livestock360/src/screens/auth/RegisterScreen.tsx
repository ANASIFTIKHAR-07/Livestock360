// src/screens/auth/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { colors, spacing, typography } from '../../config/theme';
import { isRequired, isEmail, minLength } from '../../utils/validators';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen = () => {
  const { register, login } = useAuth();
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const trimmedFullName = fullName.trim();
    const trimmedUserName = userName.trim();
    const trimmedEmail = email.trim();

    if (!isRequired(trimmedFullName)) {
      Alert.alert('Error', 'Full name is required.');
      return;
    }
    if (!isRequired(trimmedUserName) || !minLength(trimmedUserName, 3)) {
      Alert.alert('Error', 'Username must be at least 3 characters.');
      return;
    }
    if (!isEmail(trimmedEmail)) {
      Alert.alert('Error', 'Please enter a valid email.');
      return;
    }
    if (!isRequired(password) || !minLength(password, 8)) {
      Alert.alert('Error', 'Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      // Register the user
      await register({ 
        fullName: trimmedFullName, 
        userName: trimmedUserName, 
        email: trimmedEmail, 
        password 
      });
      
      console.log('✅ Registration successful, attempting auto-login...');
      
      // Auto-login after successful registration
      try {
        await login({ 
          email: trimmedEmail, 
          password 
        });
        // Navigation will be handled automatically by AppNavigator
        console.log('✅ Auto-login successful!');
      } catch (loginError: any) {
        console.error('❌ Auto-login failed:', loginError);
        Alert.alert(
          'Registration Successful', 
          'Please login with your credentials',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }
    } catch (err: any) {
      console.error('❌ Registration error:', err);
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

        {/* Back to Login Link */}
        <View style={styles.loginSection}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
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
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  loginText: {
    ...typography.body,
    color: colors.textLight,
  },
  loginLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});