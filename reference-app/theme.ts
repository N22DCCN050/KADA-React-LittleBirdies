export const colors = {
  primary: '#4F46E5', // Indigo 600
  primaryLight: '#818CF8', // Indigo 400
  primaryDark: '#3730A3', // Indigo 800
  primaryGradient: ['#4F46E5', '#7C3AED'],
  
  secondary: '#06B6D4', // Cyan 500
  accent: '#F59E0B', // Amber 500
  
  background: '#F8FAFC', // Slate 50
  card: '#FFFFFF',
  cardSecondary: '#F1F5F9', // Slate 100
  
  text: '#0F172A', // Slate 900
  textSecondary: '#64748B', // Slate 500
  subtext: '#94A3B8', // Slate 400
  
  border: '#E2E8F0', // Slate 200
  borderDark: '#CBD5E1', // Slate 300
  
  danger: '#EF4444', // Red 500
  dangerLight: '#FEE2E2', // Red 100
  dangerDark: '#991B1B', // Red 800
  
  success: '#10B981', // Emerald 500
  successLight: '#D1FAE5', // Emerald 100
  successDark: '#065F46', // Emerald 800
  
  warning: '#F59E0B', // Amber 500
  warningLight: '#FEF3C7', // Amber 100
  
  info: '#3B82F6', // Blue 500
  infoLight: '#DBEAFE', // Blue 100
  
  purple: '#8B5CF6',
  purpleLight: '#EDE9FE',
  teal: '#14B8A6',
  tealLight: '#CCFBF1',
  pink: '#EC4899',
  pinkLight: '#FCE7F3',
};

export const categories = {
  all: { key: 'all', label: 'All', icon: 'apps-outline', color: '#64748B', bg: '#F1F5F9' },
  work: { key: 'work', label: 'Work', icon: 'briefcase-outline', color: '#4F46E5', bg: '#EEF2FF', emoji: '💼' },
  study: { key: 'study', label: 'Study', icon: 'book-outline', color: '#8B5CF6', bg: '#F5F3FF', emoji: '📚' },
  birdcare: { key: 'birdcare', label: 'Bird Care', icon: 'egg-outline', color: '#059669', bg: '#ECFDF5', emoji: '🐦' },
  personal: { key: 'personal', label: 'Personal', icon: 'person-outline', color: '#0284C7', bg: '#E0F2FE', emoji: '🧘' },
  health: { key: 'health', label: 'Health', icon: 'fitness-outline', color: '#E11D48', bg: '#FFE4E6', emoji: '🏃' },
  finance: { key: 'finance', label: 'Finance', icon: 'wallet-outline', color: '#D97706', bg: '#FEF3C7', emoji: '💰' },
};

export const priorities = {
  low: { key: 'low', label: 'Low', color: '#10B981', bg: '#D1FAE5', level: 1 },
  medium: { key: 'medium', label: 'Medium', color: '#3B82F6', bg: '#DBEAFE', level: 2 },
  high: { key: 'high', label: 'High', color: '#F59E0B', bg: '#FEF3C7', level: 3 },
  urgent: { key: 'urgent', label: 'Urgent', color: '#EF4444', bg: '#FEE2E2', level: 4 },
};

export const statuses = {
  todo: { key: 'todo', label: 'To Do', color: '#64748B', bg: '#F1F5F9' },
  inprogress: { key: 'inprogress', label: 'In Progress', color: '#3B82F6', bg: '#DBEAFE' },
  done: { key: 'done', label: 'Done', color: '#10B981', bg: '#D1FAE5' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  title: 28,
  hero: 34,
};

export const shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
};
