// src/screens/profile/AboutScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/layout/Header';
import { colors, spacing } from '../../config/theme';
import Logo from '../../assets/images/Logo.png';

const AboutScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@livestock360.com').catch(err => 
      console.error('Failed to open email:', err)
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="About"
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo & Name */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Image 
              source={Logo} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>Livestock360</Text>
          <Text style={styles.tagline}>Smart Livestock Management</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 About the App</Text>
          <View style={styles.card}>
            <Text style={styles.description}>
              Livestock360 is a comprehensive farm management solution designed specifically for livestock farmers in Pakistan and South Asia. 
              {'\n\n'}
              Track your animals' health, manage vaccinations, monitor growth, and keep detailed records - all in one easy-to-use app.
            </Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Key Features</Text>
          <View style={styles.card}>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🐄</Text>
              <Text style={styles.featureText}>Animal Profile Management</Text>
            </View>
            <View style={styles.featureDivider} />
            
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>💉</Text>
              <Text style={styles.featureText}>Health & Vaccination Tracking</Text>
            </View>
            <View style={styles.featureDivider} />
            
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>📊</Text>
              <Text style={styles.featureText}>Dashboard & Analytics</Text>
            </View>
            <View style={styles.featureDivider} />
            
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🔔</Text>
              <Text style={styles.featureText}>Vaccination Reminders</Text>
            </View>
            <View style={styles.featureDivider} />
            
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>📸</Text>
              <Text style={styles.featureText}>Photo Documentation</Text>
            </View>
          </View>
        </View>

        {/* Developer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍💻 Developer</Text>
          <View style={styles.card}>
            <Text style={styles.developerText}>
              Developed with 💚 by passionate developers who care about empowering farmers with technology.
            </Text>
          </View>
        </View>

        {/* Contact & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 Contact & Support</Text>
          
          <TouchableOpacity 
            style={styles.contactCard}
            onPress={handleEmail}
            activeOpacity={0.8}
          >
            <View style={styles.contactIcon}>
              <Text style={styles.contactEmoji}>📧</Text>
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactSubtitle}>support@livestock360.com</Text>
            </View>
            <Text style={styles.contactArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactCard}
            onPress={() => handleLink('https://livestock360.com')}
            activeOpacity={0.8}
          >
            <View style={styles.contactIcon}>
              <Text style={styles.contactEmoji}>🌐</Text>
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Website</Text>
              <Text style={styles.contactSubtitle}>www.livestock360.com</Text>
            </View>
            <Text style={styles.contactArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Legal Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Legal</Text>
          
          <TouchableOpacity 
            style={styles.legalCard}
            onPress={() => handleLink('https://livestock360.com/privacy')}
            activeOpacity={0.8}
          >
            <Text style={styles.legalText}>Privacy Policy</Text>
            <Text style={styles.legalArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.legalCard}
            onPress={() => handleLink('https://livestock360.com/terms')}
            activeOpacity={0.8}
          >
            <Text style={styles.legalText}>Terms of Service</Text>
            <Text style={styles.legalArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.legalCard}
            onPress={() => handleLink('https://livestock360.com/licenses')}
            activeOpacity={0.8}
          >
            <Text style={styles.legalText}>Open Source Licenses</Text>
            <Text style={styles.legalArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>🌾 Trusted by farmers worldwide</Text>
          <Text style={styles.footerSubtext}>
            © 2024 Livestock360. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },

  // Hero Section
  heroSection: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    padding: spacing.md,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.md,
  },
  versionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  versionText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },

  // Section
  section: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Description
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text,
  },

  // Features
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
    width: 32,
  },
  featureText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  featureDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },

  // Developer
  developerText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text,
    textAlign: 'center',
  },

  // Contact Cards
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  contactEmoji: {
    fontSize: 24,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  contactArrow: {
    fontSize: 28,
    color: colors.textLight,
    fontWeight: '300',
  },

  // Legal Cards
  legalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  legalText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  legalArrow: {
    fontSize: 24,
    color: colors.textLight,
    fontWeight: '300',
  },

  // Footer
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  footerText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.textLight,
  },
});