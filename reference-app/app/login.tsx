import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LanguageToggle } from '../components/LanguageToggle';
import { api } from '../lib/api';
import { saveToken } from '../lib/auth';
import { i18n } from '../lib/i18n';
import { colors, fontSize, radius, shadows, spacing } from '../theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setTick] = useState(0);

  const handleLogin = async (overrideEmail?: string) => {
    const targetEmail = (overrideEmail || email).trim();
    if (!targetEmail) {
      Alert.alert('Validation', i18n.t('emailPlaceholder'));
      return;
    }
    try {
      setLoading(true);
      const res = await api.login(targetEmail);
      await saveToken(res.token);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Unable to log in');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (presetEmail: string) => {
    setEmail(presetEmail);
    handleLogin(presetEmail);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header language switcher */}
          <View style={styles.topBar}>
            <LanguageToggle onLanguageChange={() => setTick((t) => t + 1)} />
          </View>

          {/* Logo & Welcome Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🐦</Text>
            </View>
            <Text style={styles.brandTitle}>{i18n.t('appName')}</Text>
            <Text style={styles.brandTagline}>{i18n.t('appTagline')}</Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.title}>{i18n.t('welcomeTitle')}</Text>
            <Text style={styles.subtitle}>{i18n.t('welcomeSubtitle')}</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={i18n.t('emailPlaceholder')}
                placeholderTextColor={colors.subtext}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={() => handleLogin()}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>{i18n.t('signIn')}</Text>
              )}
            </TouchableOpacity>

            {/* Quick Demo Accounts */}
            <View style={styles.quickLoginSection}>
              <Text style={styles.quickLoginTitle}>{i18n.t('quickDemoLogin')}</Text>
              <View style={styles.presetButtonsRow}>
                <TouchableOpacity
                  style={styles.presetBtn}
                  onPress={() => quickLogin('student@littlebirdies.app')}
                >
                  <Text style={styles.presetBtnText}>{i18n.t('studentRole')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetBtn}
                  onPress={() => quickLogin('manager@littlebirdies.app')}
                >
                  <Text style={styles.presetBtnText}>{i18n.t('managerRole')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetBtn}
                  onPress={() => quickLogin('developer@littlebirdies.app')}
                >
                  <Text style={styles.presetBtnText}>{i18n.t('developerRole')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.noteText}>{i18n.t('authNote')}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    justifyContent: 'center',
    minHeight: '100%',
  },
  topBar: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#C7D2FE',
    marginBottom: spacing.sm,
    ...shadows.md,
  },
  logoEmoji: {
    fontSize: 42,
  },
  brandTitle: {
    fontSize: fontSize.title,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  quickLoginSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  quickLoginTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  presetButtonsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  presetBtn: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  presetBtnText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.primary,
  },
  noteText: {
    fontSize: fontSize.xs,
    color: colors.subtext,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 16,
  },
});
