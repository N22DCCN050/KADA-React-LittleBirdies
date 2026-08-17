import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { i18n } from '../lib/i18n';
import { categories, fontSize, priorities, radius, spacing, statuses } from '../theme';

interface BadgeProps {
  type: 'status' | 'priority' | 'category';
  value: string;
  size?: 'sm' | 'md';
}

export function Badge({ type, value, size = 'sm' }: BadgeProps) {
  let label = value;
  let bg = '#F1F5F9';
  let color = '#475569';
  let icon = '';

  if (type === 'status') {
    const statusMeta = statuses[value as keyof typeof statuses] || {
      label: value,
      color: '#64748B',
      bg: '#F1F5F9',
    };
    if (value === 'todo') label = i18n.t('statusTodo');
    else if (value === 'inprogress') label = i18n.t('statusInProgress');
    else if (value === 'done') label = i18n.t('statusDone');
    else label = statusMeta.label;

    bg = statusMeta.bg;
    color = statusMeta.color;
  } else if (type === 'priority') {
    const priMeta = priorities[value as keyof typeof priorities] || {
      label: value,
      color: '#64748B',
      bg: '#F1F5F9',
    };
    if (value === 'low') label = i18n.t('priorityLow');
    else if (value === 'medium') label = i18n.t('priorityMedium');
    else if (value === 'high') label = i18n.t('priorityHigh');
    else if (value === 'urgent') label = i18n.t('priorityUrgent');
    else label = priMeta.label;

    bg = priMeta.bg;
    color = priMeta.color;
  } else if (type === 'category') {
    const catMeta = categories[value as keyof typeof categories] || {
      label: value,
      color: '#4F46E5',
      bg: '#EEF2FF',
      emoji: '🏷️',
    };
    if (value === 'work') label = i18n.t('catWork');
    else if (value === 'study') label = i18n.t('catStudy');
    else if (value === 'birdcare') label = i18n.t('catBirdCare');
    else if (value === 'personal') label = i18n.t('catPersonal');
    else if (value === 'health') label = i18n.t('catHealth');
    else if (value === 'finance') label = i18n.t('catFinance');
    else label = catMeta.label;

    bg = catMeta.bg;
    color = catMeta.color;
  }

  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: bg }, isSmall && styles.badgeSm]}>
      <Text
        style={[
          styles.text,
          { color },
          isSmall ? styles.textSm : styles.textMd,
        ]}
      >
        {icon ? `${icon} ` : ''}
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  text: {
    fontWeight: '600',
  },
  textSm: {
    fontSize: fontSize.xs,
  },
  textMd: {
    fontSize: fontSize.sm,
  },
});
