import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LanguageToggle } from '../../components/LanguageToggle';
import { api, Item } from '../../lib/api';
import { i18n } from '../../lib/i18n';
import { categories, colors, fontSize, priorities, radius, shadows, spacing, statuses } from '../../theme';

const CACHE_KEY = 'cached_littlebirdies_tasks';

export default function TaskFormScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    subtitle?: string;
    notes?: string;
    category?: string;
    priority?: string;
    status?: string;
    dueDate?: string;
    favorite?: string;
  }>();

  const isEditing = Boolean(params.id);

  const [title, setTitle] = useState(params.title || '');
  const [subtitle, setSubtitle] = useState(params.subtitle || '');
  const [notes, setNotes] = useState(params.notes || '');
  const [category, setCategory] = useState(params.category || 'birdcare');
  const [priority, setPriority] = useState(params.priority || 'medium');
  const [status, setStatus] = useState(params.status || 'todo');
  const [dueDate, setDueDate] = useState(params.dueDate || '');
  const [favorite, setFavorite] = useState(params.favorite === 'true');

  const [saving, setSaving] = useState(false);
  const [, setTick] = useState(0);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', i18n.t('validationTitleRequired'));
      return;
    }

    const taskPayload: Partial<Item> = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      notes: notes.trim(),
      category,
      priority,
      status,
      dueDate: dueDate.trim(),
      favorite,
    };

    try {
      setSaving(true);
      let savedItem: Item;

      if (isEditing && params.id) {
        savedItem = await api.updateItem(params.id, taskPayload);
      } else {
        savedItem = await api.createItem(taskPayload);
      }

      // Update local storage cache
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      let list: Item[] = cached ? JSON.parse(cached) : [];
      if (isEditing && params.id) {
        list = list.map((i) => (i.id === params.id ? savedItem : i));
      } else {
        list.unshift(savedItem);
      }
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(list));

      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Header Bar */}
          <View style={styles.headerRight}>
            <Text style={styles.heading}>
              {isEditing ? i18n.t('editItem') : i18n.t('newItem')}
            </Text>
            <LanguageToggle onLanguageChange={() => setTick((t) => t + 1)} />
          </View>

          {/* Title Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{i18n.t('titleLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder={i18n.t('titlePlaceholder')}
              placeholderTextColor={colors.subtext}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Subtitle Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{i18n.t('subtitleLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder={i18n.t('subtitlePlaceholder')}
              placeholderTextColor={colors.subtext}
              value={subtitle}
              onChangeText={setSubtitle}
            />
          </View>

          {/* Category Selector */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{i18n.t('categoryLabel')}</Text>
            <View style={styles.chipsWrap}>
              {Object.entries(categories)
                .filter(([key]) => key !== 'all')
                .map(([key, meta]) => {
                  const isSelected = category === key;
                  let catLabel = meta.label;
                  if (key === 'work') catLabel = i18n.t('catWork');
                  else if (key === 'study') catLabel = i18n.t('catStudy');
                  else if (key === 'birdcare') catLabel = i18n.t('catBirdCare');
                  else if (key === 'personal') catLabel = i18n.t('catPersonal');
                  else if (key === 'health') catLabel = i18n.t('catHealth');
                  else if (key === 'finance') catLabel = i18n.t('catFinance');

                  return (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.chip,
                        isSelected && { backgroundColor: meta.color, borderColor: meta.color },
                      ]}
                      onPress={() => setCategory(key)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        {catLabel}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </View>

          {/* Priority Selector */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{i18n.t('priorityLabel')}</Text>
            <View style={styles.priorityRow}>
              {Object.entries(priorities).map(([key, meta]) => {
                const isSelected = priority === key;
                let priLabel = meta.label;
                if (key === 'low') priLabel = i18n.t('priorityLow');
                else if (key === 'medium') priLabel = i18n.t('priorityMedium');
                else if (key === 'high') priLabel = i18n.t('priorityHigh');
                else if (key === 'urgent') priLabel = i18n.t('priorityUrgent');

                return (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.priorityBtn,
                      isSelected && { backgroundColor: meta.color, borderColor: meta.color },
                    ]}
                    onPress={() => setPriority(key)}
                  >
                    <Text
                      style={[
                        styles.priorityBtnText,
                        isSelected && styles.priorityBtnTextSelected,
                      ]}
                    >
                      {priLabel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Status Selector */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{i18n.t('statusLabel')}</Text>
            <View style={styles.priorityRow}>
              {(['todo', 'inprogress', 'done'] as const).map((st) => {
                const isSelected = status === st;
                const meta = statuses[st];
                let label = meta.label;
                if (st === 'todo') label = i18n.t('statusTodo');
                else if (st === 'inprogress') label = i18n.t('statusInProgress');
                else if (st === 'done') label = i18n.t('statusDone');

                return (
                  <TouchableOpacity
                    key={st}
                    style={[
                      styles.priorityBtn,
                      isSelected && { backgroundColor: meta.color, borderColor: meta.color },
                    ]}
                    onPress={() => setStatus(st)}
                  >
                    <Text
                      style={[
                        styles.priorityBtnText,
                        isSelected && styles.priorityBtnTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Due Date */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{i18n.t('dueDateLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder={i18n.t('dueDatePlaceholder')}
              placeholderTextColor={colors.subtext}
              value={dueDate}
              onChangeText={setDueDate}
            />
          </View>

          {/* Detailed Notes */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{i18n.t('notesLabel')}</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder={i18n.t('notesPlaceholder')}
              placeholderTextColor={colors.subtext}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Favorite Switch */}
          <View style={styles.switchRow}>
            <Text style={styles.label}>{i18n.t('favoriteLabel')}</Text>
            <Switch
              value={favorite}
              onValueChange={setFavorite}
              trackColor={{ false: '#E2E8F0', true: colors.primaryLight }}
              thumbColor={favorite ? colors.primary : '#F1F5F9'}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.saveBtnContent}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                <Text style={styles.saveText}>{i18n.t('save')}</Text>
              </View>
            )}
          </TouchableOpacity>
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
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 80,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  heading: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textarea: {
    height: 100,
    paddingTop: spacing.sm,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    borderRadius: radius.sm,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  priorityBtnText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  priorityBtnTextSelected: {
    color: '#FFFFFF',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  saveBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
