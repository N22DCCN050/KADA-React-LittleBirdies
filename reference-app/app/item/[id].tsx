import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Badge } from '../../components/Badge';
import { LanguageToggle } from '../../components/LanguageToggle';
import { api, Item } from '../../lib/api';
import { i18n } from '../../lib/i18n';
import { colors, fontSize, priorities, radius, shadows, spacing, statuses } from '../../theme';

const CACHE_KEY = 'cached_littlebirdies_tasks';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      // Try local cache first
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const list: Item[] = JSON.parse(cached);
        const found = list.find((i) => i.id === id);
        if (found) setItem(found);
      }

      const data = await api.getItem(id);
      setItem(data);
    } catch (err: any) {
      console.log('Failed fetching detail from API:', err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useFocusEffect(
    useCallback(() => {
      fetchDetail();
    }, [fetchDetail])
  );

  const handleUpdateStatus = async (newStatus: string) => {
    if (!item) return;
    const updated = { ...item, status: newStatus, updatedAt: new Date().toISOString() };
    setItem(updated);

    try {
      await api.updateItem(item.id, { status: newStatus });
      // update cache list
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const list: Item[] = JSON.parse(cached);
        const updatedList = list.map((i) => (i.id === item.id ? updated : i));
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedList));
      }
    } catch (e) {
      console.warn('Status update API failed:', e);
    }
  };

  const handleToggleFavorite = async () => {
    if (!item) return;
    const nextFav = !item.favorite;
    const updated = { ...item, favorite: nextFav, updatedAt: new Date().toISOString() };
    setItem(updated);

    try {
      await api.updateItem(item.id, { favorite: nextFav });
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const list: Item[] = JSON.parse(cached);
        const updatedList = list.map((i) => (i.id === item.id ? updated : i));
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedList));
      }
    } catch (e) {
      console.warn('Favorite update API failed:', e);
    }
  };

  const handleDelete = () => {
    if (!item) return;
    Alert.alert(
      i18n.t('deleteTitle'),
      i18n.t('deleteConfirm', { title: item.title }),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteItem(item.id);
              const cached = await AsyncStorage.getItem(CACHE_KEY);
              if (cached) {
                const list: Item[] = JSON.parse(cached);
                const updatedList = list.filter((i) => i.id !== item.id);
                await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedList));
              }
              router.back();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  if (loading && !item) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>{i18n.t('notFound')}</Text>
      </SafeAreaView>
    );
  }

  const priorityMeta = priorities[item.priority as keyof typeof priorities] || priorities.medium;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header Action Row */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.favoriteCircleBtn}
            onPress={handleToggleFavorite}
          >
            <Ionicons
              name={item.favorite ? 'star' : 'star-outline'}
              size={22}
              color={item.favorite ? '#F59E0B' : colors.textSecondary}
            />
          </TouchableOpacity>
          <LanguageToggle onLanguageChange={() => setTick((t) => t + 1)} />
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={[styles.priorityStripe, { backgroundColor: priorityMeta.color }]} />

          <View style={styles.badgeRow}>
            {item.category && <Badge type="category" value={item.category} size="md" />}
            {item.priority && <Badge type="priority" value={item.priority} size="md" />}
            {item.status && <Badge type="status" value={item.status} size="md" />}
          </View>

          <Text style={styles.title}>{item.title}</Text>
          {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}

          {/* Quick Status Switcher */}
          <View style={styles.statusSwitcher}>
            <Text style={styles.sectionLabel}>{i18n.t('statusLabel')}:</Text>
            <View style={styles.statusButtonsRow}>
              {(['todo', 'inprogress', 'done'] as const).map((st) => {
                const isActive = item.status === st;
                const meta = statuses[st];
                let label = meta.label;
                if (st === 'todo') label = i18n.t('statusTodo');
                if (st === 'inprogress') label = i18n.t('statusInProgress');
                if (st === 'done') label = i18n.t('statusDone');

                return (
                  <TouchableOpacity
                    key={st}
                    style={[
                      styles.statusBtn,
                      isActive && { backgroundColor: meta.color, borderColor: meta.color },
                    ]}
                    onPress={() => handleUpdateStatus(st)}
                  >
                    <Text
                      style={[
                        styles.statusBtnText,
                        isActive && styles.statusBtnTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Notes & Description Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionHeaderTitle}>{i18n.t('descriptionLabel')}</Text>
          </View>
          <Text style={styles.notesText}>
            {item.notes || item.subtitle || i18n.t('noDescription')}
          </Text>
        </View>

        {/* Timeline & Metadata Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionHeaderTitle}>{i18n.t('timelineLabel')}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>{i18n.t('itemId')}</Text>
            <Text style={styles.metaValue}>#{item.id}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>{i18n.t('dueDateLabel')}</Text>
            <Text style={[styles.metaValue, item.dueDate ? styles.dueHighlight : null]}>
              {item.dueDate || i18n.t('noDueDate')}
            </Text>
          </View>

          {item.createdAt && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>{i18n.t('createdAt')}</Text>
              <Text style={styles.metaValue}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}

          {item.updatedAt && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>{i18n.t('updatedAt')}</Text>
              <Text style={styles.metaValue}>
                {new Date(item.updatedAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons: Edit & Delete */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              router.push({
                pathname: '/item/new',
                params: {
                  id: item.id,
                  title: item.title,
                  subtitle: item.subtitle,
                  notes: item.notes,
                  category: item.category,
                  priority: item.priority,
                  status: item.status,
                  dueDate: item.dueDate,
                  favorite: item.favorite ? 'true' : 'false',
                },
              })
            }
          >
            <Ionicons name="create-outline" size={18} color="#FFFFFF" />
            <Text style={styles.editText}>{i18n.t('editItem')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
            <Text style={styles.deleteText}>{i18n.t('delete')}</Text>
          </TouchableOpacity>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  favoriteCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.danger,
    fontWeight: '600',
  },
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.md,
  },
  priorityStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 22,
  },
  statusSwitcher: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  statusButtonsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusBtnText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  statusBtnTextActive: {
    color: '#FFFFFF',
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
    marginBottom: spacing.sm,
  },
  sectionHeaderTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text,
  },
  notesText: {
    fontSize: fontSize.sm,
    color: colors.text,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  metaLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  metaValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  dueHighlight: {
    color: colors.primary,
    fontWeight: '700',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  editButton: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    ...shadows.sm,
  },
  editText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  deleteText: {
    color: colors.danger,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
