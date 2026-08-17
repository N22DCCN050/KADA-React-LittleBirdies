import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { CategoryFilter } from '../../components/CategoryFilter';
import { LanguageToggle } from '../../components/LanguageToggle';
import { api, Item } from '../../lib/api';
import { i18n } from '../../lib/i18n';
import { colors, fontSize, radius, shadows, spacing } from '../../theme';

const CACHE_KEY = 'cached_littlebirdies_tasks';

type StatusFilterType = 'all' | 'todo' | 'inprogress' | 'done' | 'favorite';
type SortOptionType = 'newest' | 'priority' | 'dueDate' | 'title';

export default function TaskListScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilterType>('all');
  const [sortBy, setSortBy] = useState<SortOptionType>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [, setTick] = useState(0);

  const loadData = useCallback(async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to read cache:', e);
    }

    try {
      const data = await api.getItems();
      if (Array.isArray(data) && data.length > 0) {
        setItems(data);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
      }
    } catch (err: any) {
      console.log('API fetch fallback mode:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Toggle Done / In Progress
  const handleToggleStatus = async (item: Item) => {
    const nextStatus = item.status === 'done' ? 'todo' : 'done';
    const updatedItems = items.map((i) =>
      i.id === item.id ? { ...i, status: nextStatus, updatedAt: new Date().toISOString() } : i
    );
    setItems(updatedItems);
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedItems));

    try {
      await api.updateItem(item.id, { status: nextStatus });
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = async (item: Item) => {
    const updatedItems = items.map((i) =>
      i.id === item.id ? { ...i, favorite: !i.favorite, updatedAt: new Date().toISOString() } : i
    );
    setItems(updatedItems);
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedItems));

    try {
      await api.updateItem(item.id, { favorite: !item.favorite });
    } catch (err) {
      console.warn('Backend sync failed, saved locally:', err);
    }
  };

  // Delete Item
  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      i18n.t('deleteTitle'),
      i18n.t('deleteConfirm', { title }),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('delete'),
          style: 'destructive',
          onPress: async () => {
            const previousItems = [...items];
            const updatedItems = previousItems.filter((item) => item.id !== id);
            setItems(updatedItems);
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedItems));
            try {
              await api.deleteItem(id);
            } catch (err: any) {
              setItems(previousItems);
              Alert.alert('Error', err.message || 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((i) => i.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus === 'favorite') {
      result = result.filter((i) => i.favorite);
    } else if (selectedStatus !== 'all') {
      result = result.filter((i) => i.status === selectedStatus);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (i) =>
          (i.title && i.title.toLowerCase().includes(q)) ||
          (i.subtitle && i.subtitle.toLowerCase().includes(q)) ||
          (i.notes && i.notes.toLowerCase().includes(q))
      );
    }

    // Sorting
    const priorityWeights: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
    if (sortBy === 'newest') {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    } else if (sortBy === 'priority') {
      result.sort((a, b) => {
        const wA = priorityWeights[a.priority || 'medium'] || 0;
        const wB = priorityWeights[b.priority || 'medium'] || 0;
        return wB - wA;
      });
    } else if (sortBy === 'dueDate') {
      result.sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [items, selectedCategory, selectedStatus, searchQuery, sortBy]);

  const completedCount = useMemo(
    () => items.filter((i) => i.status === 'done').length,
    [items]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <Text style={styles.appBadge}>🐦 {i18n.t('appName')}</Text>
            <Text style={styles.headerTitle}>{i18n.t('itemsTitle')}</Text>
          </View>
          <View style={styles.headerActions}>
            <LanguageToggle onLanguageChange={() => setTick((t) => t + 1)} />
          </View>
        </View>

        {/* Search Bar & Sort Button */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder={i18n.t('searchPlaceholder')}
              placeholderTextColor={colors.subtext}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.subtext} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.sortButton, showSortMenu && styles.sortButtonActive]}
            onPress={() => setShowSortMenu(!showSortMenu)}
          >
            <Ionicons
              name="swap-vertical"
              size={18}
              color={showSortMenu ? '#FFFFFF' : colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Sort Menu Dropdown if toggled */}
        {showSortMenu && (
          <View style={styles.sortMenu}>
            <Text style={styles.sortMenuTitle}>{i18n.t('sortBy')}:</Text>
            <View style={styles.sortOptionsRow}>
              {(
                [
                  { key: 'newest', label: i18n.t('sortNewest') },
                  { key: 'priority', label: i18n.t('sortPriority') },
                  { key: 'dueDate', label: i18n.t('sortDueDate') },
                  { key: 'title', label: i18n.t('sortTitle') },
                ] as const
              ).map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.sortOptionChip,
                    sortBy === opt.key && styles.sortOptionChipActive,
                  ]}
                  onPress={() => {
                    setSortBy(opt.key);
                    setShowSortMenu(false);
                  }}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      sortBy === opt.key && styles.sortOptionTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Category Horizontal Filter Chips */}
        <View style={styles.categoryFilterContainer}>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </View>

        {/* Status Filter Tabs (All, Todo, InProgress, Done, Favorite) */}
        <View style={styles.statusTabs}>
          {(
            [
              { key: 'all', label: i18n.t('filterAll') },
              { key: 'todo', label: i18n.t('filterTodo') },
              { key: 'inprogress', label: i18n.t('filterInProgress') },
              { key: 'done', label: i18n.t('filterDone') },
              { key: 'favorite', label: i18n.t('filterFavorite') },
            ] as const
          ).map((tab) => {
            const isSelected = selectedStatus === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.statusTabBtn, isSelected && styles.statusTabBtnActive]}
                onPress={() => setSelectedStatus(tab.key)}
              >
                <Text
                  style={[
                    styles.statusTabText,
                    isSelected && styles.statusTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Metrics Subtitle */}
        <View style={styles.statsSummaryRow}>
          <Text style={styles.statsSummaryText}>
            {i18n.t('taskCount', { count: filteredItems.length })}
          </Text>
          <Text style={styles.statsDoneText}>
            {i18n.t('completedCount', { done: completedCount, total: items.length })}
          </Text>
        </View>

        {/* Tasks FlatList */}
        {loading && items.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card
                item={item}
                onPress={() => router.push({ pathname: '/item/[id]', params: { id: item.id } })}
                onToggleStatus={() => handleToggleStatus(item)}
                onToggleFavorite={() => handleToggleFavorite(item)}
                onDelete={() => handleDelete(item.id, item.title)}
              />
            )}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={loadData}
                colors={[colors.primary]}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="sparkles-outline" size={54} color={colors.primaryLight} />
                <Text style={styles.emptyTitle}>{i18n.t('emptyTasksTitle')}</Text>
                <Text style={styles.emptyDesc}>{i18n.t('emptyTasksDesc')}</Text>
                <TouchableOpacity
                  style={styles.emptyAddBtn}
                  onPress={() => router.push('/item/new')}
                >
                  <Text style={styles.emptyAddBtnText}>{i18n.t('addItem')}</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}

        {/* Floating Action Button (FAB) */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/item/new')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.card,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.card,
  },
  headerLeft: {
    flex: 1,
  },
  appBadge: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.card,
    gap: spacing.sm,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    height: 42,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text,
    paddingHorizontal: spacing.xs,
  },
  sortButton: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  sortButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortMenu: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sortMenuTitle: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  sortOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sortOptionChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: '#F1F5F9',
  },
  sortOptionChipActive: {
    backgroundColor: colors.primary,
  },
  sortOptionText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sortOptionTextActive: {
    color: '#FFFFFF',
  },
  categoryFilterContainer: {
    backgroundColor: colors.card,
    paddingBottom: spacing.xs,
  },
  statusTabs: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 4,
  },
  statusTabBtn: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
  },
  statusTabBtnActive: {
    backgroundColor: '#EEF2FF',
  },
  statusTabText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statusTabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  statsSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statsSummaryText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statsDoneText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.success,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 80,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
  },
  emptyDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  emptyAddBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.md,
  },
  emptyAddBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
});
