import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, Item, Stats } from '../../lib/api';
import { i18n } from '../../lib/i18n';
import { categories, colors, fontSize, priorities, radius, shadows, spacing } from '../../theme';

const CACHE_KEY = 'cached_littlebirdies_tasks';

export default function AnalyticsScreen() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const calculateLocalStats = (items: Item[]): Stats => {
    const total = items.length;
    const completed = items.filter((i) => i.status === 'done').length;
    const inProgress = items.filter((i) => i.status === 'inprogress').length;
    const todo = items.filter((i) => i.status === 'todo').length;
    const favorites = items.filter((i) => i.favorite).length;

    const categoryBreakdown: Record<string, number> = {};
    const priorityBreakdown: Record<string, number> = {};

    items.forEach((i) => {
      const cat = i.category || 'personal';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;

      const pri = i.priority || 'medium';
      priorityBreakdown[pri] = (priorityBreakdown[pri] || 0) + 1;
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      todo,
      favorites,
      completionRate,
      categoryBreakdown,
      priorityBreakdown,
    };
  };

  const loadStats = useCallback(async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsedItems: Item[] = JSON.parse(cached);
        setStats(calculateLocalStats(parsedItems));
      }
    } catch (e) {
      console.warn('Failed reading cache for stats:', e);
    }

    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err: any) {
      console.log('Failed fetching backend stats, using calculated:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const getProductivityHealth = (rate: number) => {
    if (rate >= 70) return { label: i18n.t('excellentRate'), color: colors.success };
    if (rate >= 40) return { label: i18n.t('goodRate'), color: colors.primary };
    return { label: i18n.t('needsWorkRate'), color: colors.warning };
  };

  if (loading && !stats) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const rate = stats?.completionRate ?? 0;
  const health = getProductivityHealth(rate);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadStats}
            colors={[colors.primary]}
          />
        }
      >
        {/* Productivity Score Banner */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <View>
              <Text style={styles.scoreTitle}>{i18n.t('productivityScore')}</Text>
              <Text style={[styles.scoreHealth, { color: health.color }]}>{health.label}</Text>
            </View>
            <View style={styles.rateBadge}>
              <Text style={styles.ratePercentText}>{rate}%</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(100, Math.max(0, rate))}%` },
              ]}
            />
          </View>
          <Text style={styles.progressNote}>
            {stats?.completed || 0} / {stats?.total || 0} {i18n.t('completedCard').toLowerCase()}
          </Text>
        </View>

        {/* 4 KPIs Matrix */}
        <View style={styles.kpiGrid}>
          {/* Total Tasks */}
          <View style={[styles.kpiCard, { borderColor: '#E2E8F0' }]}>
            <View style={[styles.kpiIcon, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="list" size={20} color={colors.primary} />
            </View>
            <Text style={styles.kpiValue}>{stats?.total || 0}</Text>
            <Text style={styles.kpiLabel}>{i18n.t('totalTasksCard')}</Text>
          </View>

          {/* Completed Tasks */}
          <View style={[styles.kpiCard, { borderColor: '#D1FAE5' }]}>
            <View style={[styles.kpiIcon, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            </View>
            <Text style={[styles.kpiValue, { color: colors.success }]}>
              {stats?.completed || 0}
            </Text>
            <Text style={styles.kpiLabel}>{i18n.t('completedCard')}</Text>
          </View>

          {/* In Progress */}
          <View style={[styles.kpiCard, { borderColor: '#DBEAFE' }]}>
            <View style={[styles.kpiIcon, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="time" size={20} color={colors.info} />
            </View>
            <Text style={[styles.kpiValue, { color: colors.info }]}>
              {stats?.inProgress || 0}
            </Text>
            <Text style={styles.kpiLabel}>{i18n.t('inProgressCard')}</Text>
          </View>

          {/* To Do / Pending */}
          <View style={[styles.kpiCard, { borderColor: '#FEF3C7' }]}>
            <View style={[styles.kpiIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="hourglass-outline" size={20} color={colors.warning} />
            </View>
            <Text style={[styles.kpiValue, { color: colors.warning }]}>
              {stats?.todo || 0}
            </Text>
            <Text style={styles.kpiLabel}>{i18n.t('pendingCard')}</Text>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="pie-chart-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>{i18n.t('categoryDistribution')}</Text>
          </View>

          {Object.entries(categories)
            .filter(([key]) => key !== 'all')
            .map(([key, meta]) => {
              const count = stats?.categoryBreakdown?.[key] || 0;
              const total = stats?.total || 1;
              const percent = Math.round((count / total) * 100);

              let catLabel = meta.label;
              if (key === 'work') catLabel = i18n.t('catWork');
              else if (key === 'study') catLabel = i18n.t('catStudy');
              else if (key === 'birdcare') catLabel = i18n.t('catBirdCare');
              else if (key === 'personal') catLabel = i18n.t('catPersonal');
              else if (key === 'health') catLabel = i18n.t('catHealth');
              else if (key === 'finance') catLabel = i18n.t('catFinance');

              return (
                <View key={key} style={styles.breakdownRow}>
                  <View style={styles.breakdownLabelRow}>
                    <Text style={styles.breakdownCategoryName}>{catLabel}</Text>
                    <Text style={styles.breakdownCountText}>
                      {count} ({percent}%)
                    </Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${percent}%`, backgroundColor: meta.color },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
        </View>

        {/* Priority Breakdown */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flame-outline" size={20} color={colors.danger} />
            <Text style={styles.sectionTitle}>{i18n.t('priorityDistribution')}</Text>
          </View>

          {Object.entries(priorities).map(([key, meta]) => {
            const count = stats?.priorityBreakdown?.[key] || 0;
            const total = stats?.total || 1;
            const percent = Math.round((count / total) * 100);

            let priLabel = meta.label;
            if (key === 'low') priLabel = i18n.t('priorityLow');
            else if (key === 'medium') priLabel = i18n.t('priorityMedium');
            else if (key === 'high') priLabel = i18n.t('priorityHigh');
            else if (key === 'urgent') priLabel = i18n.t('priorityUrgent');

            return (
              <View key={key} style={styles.breakdownRow}>
                <View style={styles.breakdownLabelRow}>
                  <Text style={styles.breakdownCategoryName}>{priLabel}</Text>
                  <Text style={styles.breakdownCountText}>
                    {count} ({percent}%)
                  </Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${percent}%`, backgroundColor: meta.color },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  scoreTitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  scoreHealth: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    marginTop: 2,
  },
  rateBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  ratePercentText: {
    fontSize: fontSize.xl,
    fontWeight: '900',
    color: colors.primary,
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  progressNote: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  kpiCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    ...shadows.sm,
  },
  kpiIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  kpiValue: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
  },
  kpiLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  breakdownRow: {
    marginBottom: spacing.sm,
  },
  breakdownLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  breakdownCategoryName: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  breakdownCountText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  barTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: radius.full,
  },
});
