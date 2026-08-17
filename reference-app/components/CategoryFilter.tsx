import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { i18n } from '../lib/i18n';
import { categories, fontSize, radius, spacing } from '../theme';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (categoryKey: string) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const categoryList = [
    { key: 'all', label: i18n.t('allCategories'), emoji: '✨' },
    { key: 'birdcare', label: i18n.t('catBirdCare'), emoji: '🐦' },
    { key: 'work', label: i18n.t('catWork'), emoji: '💼' },
    { key: 'study', label: i18n.t('catStudy'), emoji: '📚' },
    { key: 'personal', label: i18n.t('catPersonal'), emoji: '🧘' },
    { key: 'health', label: i18n.t('catHealth'), emoji: '🏃' },
    { key: 'finance', label: i18n.t('catFinance'), emoji: '💰' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categoryList.map((cat) => {
        const isSelected = selectedCategory === cat.key;
        return (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.chip,
              isSelected && styles.chipSelected,
            ]}
            onPress={() => onSelectCategory(cat.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipSelected: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  chipText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
});
