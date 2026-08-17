import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { i18n, setLanguage } from '../lib/i18n';
import { colors, fontSize, radius, spacing } from '../theme';

interface LanguageToggleProps {
  onLanguageChange?: () => void;
}

export function LanguageToggle({ onLanguageChange }: LanguageToggleProps) {
  const [currentLang, setCurrentLang] = useState(i18n.locale.startsWith('vi') ? 'vi' : 'en');

  const toggleLanguage = (lang: 'en' | 'vi') => {
    setLanguage(lang);
    setCurrentLang(lang);
    if (onLanguageChange) {
      onLanguageChange();
    }
  };

  return (
    <View style={styles.langBar}>
      <TouchableOpacity
        style={[styles.langBtn, currentLang === 'vi' && styles.langBtnActive]}
        onPress={() => toggleLanguage('vi')}
        activeOpacity={0.7}
      >
        <Text style={[styles.langText, currentLang === 'vi' && styles.langTextActive]}>🇻🇳 VI</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.langBtn, currentLang === 'en' && styles.langBtnActive]}
        onPress={() => toggleLanguage('en')}
        activeOpacity={0.7}
      >
        <Text style={[styles.langText, currentLang === 'en' && styles.langTextActive]}>🇬🇧 EN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  langBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: radius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  langBtnActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  langText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  langTextActive: {
    color: '#FFFFFF',
  },
});
