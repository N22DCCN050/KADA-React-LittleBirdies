import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Item } from '../lib/api';
import { i18n } from '../lib/i18n';
import { categories, colors, fontSize, priorities, radius, shadows, spacing } from '../theme';
import { Badge } from './Badge';

interface TaskCardProps {
  item: Item;
  onPress?: () => void;
  onToggleStatus?: () => void;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
}

export function Card({
  item,
  onPress,
  onToggleStatus,
  onToggleFavorite,
  onDelete,
}: TaskCardProps) {
  const isDone = item.status === 'done';
  const categoryMeta = categories[item.category as keyof typeof categories] || categories.personal;
  const priorityMeta = priorities[item.priority as keyof typeof priorities] || priorities.medium;

  return (
    <TouchableOpacity
      style={[styles.card, isDone && styles.cardDone]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Top Accent Stripe */}
      <View style={[styles.accentStrip, { backgroundColor: priorityMeta.color }]} />

      <View style={styles.content}>
        {/* Header Row: Checkbox, Title, Favorite */}
        <View style={styles.headerRow}>
          {/* Quick Toggle Done Checkbox */}
          <TouchableOpacity
            style={[styles.checkbox, isDone && styles.checkboxDone]}
            onPress={onToggleStatus}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isDone ? (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            ) : (
              <View style={styles.checkboxEmpty} />
            )}
          </TouchableOpacity>

          {/* Title & Subtitle */}
          <View style={styles.textContainer}>
            <Text
              style={[styles.title, isDone && styles.titleDone]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            {item.subtitle ? (
              <Text
                style={[styles.subtitle, isDone && styles.subtitleDone]}
                numberOfLines={2}
              >
                {item.subtitle}
              </Text>
            ) : null}
          </View>

          {/* Favorite Star Button */}
          {onToggleFavorite ? (
            <TouchableOpacity
              style={styles.actionIconBtn}
              onPress={onToggleFavorite}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={item.favorite ? 'star' : 'star-outline'}
                size={20}
                color={item.favorite ? '#F59E0B' : colors.subtext}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Footer Meta Row: Category Badge, Priority Badge, Due Date, Delete */}
        <View style={styles.footerRow}>
          <View style={styles.badgeGroup}>
            {item.category ? (
              <Badge type="category" value={item.category} size="sm" />
            ) : null}
            {item.priority ? (
              <Badge type="priority" value={item.priority} size="sm" />
            ) : null}
            {item.status ? (
              <Badge type="status" value={item.status} size="sm" />
            ) : null}
          </View>

          {/* Due date or delete button */}
          <View style={styles.rightFooter}>
            {item.dueDate ? (
              <View style={styles.dueDateBadge}>
                <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
                <Text style={styles.dueDateText}>{item.dueDate}</Text>
              </View>
            ) : null}

            {onDelete ? (
              <TouchableOpacity
                style={styles.deleteIconButton}
                onPress={onDelete}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="trash-outline" size={16} color={colors.danger} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardDone: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.85,
  },
  accentStrip: {
    width: 5,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkboxEmpty: {
    width: 0,
    height: 0,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 20,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.subtext,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  subtitleDone: {
    color: colors.subtext,
  },
  actionIconBtn: {
    padding: 2,
    marginLeft: spacing.xs,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  rightFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginLeft: spacing.sm,
  },
  dueDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.sm,
    gap: 4,
  },
  dueDateText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  deleteIconButton: {
    padding: 4,
    borderRadius: radius.sm,
    backgroundColor: '#FEE2E2',
    marginLeft: 4,
  },
});
