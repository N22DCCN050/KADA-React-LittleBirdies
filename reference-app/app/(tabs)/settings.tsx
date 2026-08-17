import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LanguageToggle } from '../../components/LanguageToggle';
import { api } from '../../lib/api';
import { clearToken } from '../../lib/auth';
import { i18n } from '../../lib/i18n';
import { colors, fontSize, radius, shadows, spacing } from '../../theme';

const CACHE_KEY = 'cached_littlebirdies_tasks';

const TEAM_MEMBERS = [
  { id: 1, name: 'Huỳnh Bá Anh Khoa', code: 'N22DCCN141', role: 'Team Leader & Fullstack' },
  { id: 2, name: 'Vũ Kim Long', code: 'N22DCCN050', role: 'Frontend & React Native' },
  { id: 3, name: 'Trần Tuấn Hải', code: 'N22DCCN026', role: 'Backend & Mock Services' },
  { id: 4, name: 'Đặng Nhật Nam', code: 'N22DCDT038', role: 'UI/UX & Documentation' },
  { id: 5, name: 'Tạ Quang An', code: 'N22DCAT003', role: 'QA & Test Integration' },
];

export default function SettingsScreen() {
  const [cachedCount, setCachedCount] = useState(0);
  const [, setTick] = useState(0);

  const checkCache = useCallback(async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const items = JSON.parse(cached);
        setCachedCount(Array.isArray(items) ? items.length : 0);
      } else {
        setCachedCount(0);
      }
    } catch {
      setCachedCount(0);
    }
  }, []);

  useEffect(() => {
    checkCache();
  }, [checkCache]);

  useFocusEffect(
    useCallback(() => {
      checkCache();
    }, [checkCache])
  );

  const handleClearCache = async () => {
    await AsyncStorage.removeItem(CACHE_KEY);
    setCachedCount(0);
    Alert.alert('Success', i18n.t('cacheCleared'));
  };

  const handleReloadSeed = async () => {
    try {
      const res = await api.resetSeedData();
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(res.items));
      setCachedCount(res.items.length);
      Alert.alert('Success', i18n.t('seedReloaded'));
    } catch (err: any) {
      Alert.alert('Notice', 'Demo seed reset locally.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      i18n.t('logOut'),
      i18n.t('logoutConfirm'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('logOut'),
          style: 'destructive',
          onPress: async () => {
            await clearToken();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🐦</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>LittleBirdies Pilot</Text>
            <Text style={styles.profileEmail}>pilot@littlebirdies.app</Text>
            <View style={styles.rolePill}>
              <Text style={styles.roleText}>{i18n.t('studentRole')}</Text>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>{i18n.t('preferences')}</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLabelGroup}>
              <Ionicons name="language-outline" size={20} color={colors.primary} />
              <Text style={styles.settingLabel}>{i18n.t('language')}</Text>
            </View>
            <LanguageToggle onLanguageChange={() => setTick((t) => t + 1)} />
          </View>
        </View>

        {/* Data & Storage Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>{i18n.t('cacheManagement')}</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLabelGroup}>
              <Ionicons name="server-outline" size={20} color={colors.info} />
              <Text style={styles.settingLabel}>
                {i18n.t('cachedItemsCount', { count: cachedCount })}
              </Text>
            </View>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.actionBtnOutline} onPress={handleClearCache}>
              <Ionicons name="trash-outline" size={16} color={colors.danger} />
              <Text style={styles.actionBtnOutlineText}>{i18n.t('clearCache')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtnSecondary} onPress={handleReloadSeed}>
              <Ionicons name="refresh-outline" size={16} color={colors.primary} />
              <Text style={styles.actionBtnSecondaryText}>{i18n.t('reloadSeedData')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Team LittleBirdies Information */}
        <View style={styles.sectionCard}>
          <View style={styles.teamHeader}>
            <View style={styles.teamIconBox}>
              <Text style={{ fontSize: 20 }}>🐣</Text>
            </View>
            <View>
              <Text style={styles.teamTitle}>{i18n.t('teamInfo')}</Text>
              <Text style={styles.teamSubtitle}>{i18n.t('teamSubtitle')}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.membersHeader}>{i18n.t('teamMembers')}:</Text>
          {TEAM_MEMBERS.map((member) => (
            <View key={member.id} style={styles.memberRow}>
              <View style={styles.memberNumber}>
                <Text style={styles.memberNumberText}>{member.id}</Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>
                  {member.code} • {member.role}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* App Info & Logout */}
        <View style={styles.sectionCard}>
          <View style={styles.appInfoRow}>
            <Text style={styles.appInfoLabel}>{i18n.t('appInfo')}</Text>
            <Text style={styles.appInfoValue}>v1.0.0 • Expo SDK 54</Text>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            <Text style={styles.logoutBtnText}>{i18n.t('logOut')}</Text>
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
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#C7D2FE',
  },
  avatarText: {
    fontSize: 30,
  },
  profileInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  profileName: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
  },
  profileEmail: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rolePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginTop: 6,
  },
  roleText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: '#0284C7',
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
  sectionHeaderTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  settingLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  btnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  actionBtnOutlineText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.danger,
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    backgroundColor: '#EEF2FF',
  },
  actionBtnSecondaryText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.primary,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  teamIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  teamSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: spacing.md,
  },
  membersHeader: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  memberNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  memberNumberText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text,
  },
  memberRole: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  appInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appInfoLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  appInfoValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    gap: spacing.xs,
    ...shadows.sm,
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
