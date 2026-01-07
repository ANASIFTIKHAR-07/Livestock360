import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { colors, spacing } from '../../config/theme';

// ✅ Updated logo path
import Logo from '../../assets/images/Logo.png'


type SplashScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Splash'>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  // Animation refs
  const logoScale = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Run animations in parallel
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to login after 2s
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, logoScale, titleOpacity]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={Logo}
        style={[styles.logo, { transform: [{ scale: logoScale }] }]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        Livestock360
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: titleOpacity }]}>
        Smart Livestock Management
      </Animated.Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  logo: {
    width: 190,
    height: 190,
    marginBottom: 6, // ✅ reduced gap
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.background,
    marginBottom: 2, // ✅ tight spacing
  },
  subtitle: {
    fontSize: 16,
    color: colors.background,
    opacity: 0.9,
  },
});

