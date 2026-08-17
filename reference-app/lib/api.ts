import { getToken } from './auth';

export const API_BASE_URL = 'http://localhost:5000';

export interface Item {
  id: string;
  title: string;
  subtitle?: string;
  notes?: string;
  category?: 'work' | 'study' | 'birdcare' | 'personal' | 'health' | 'finance' | string;
  priority?: 'low' | 'medium' | 'high' | 'urgent' | string;
  status?: 'todo' | 'inprogress' | 'done' | string;
  dueDate?: string;
  favorite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Stats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  favorites: number;
  completionRate: number;
  categoryBreakdown: Record<string, number>;
  priorityBreakdown: Record<string, number>;
}

export interface ItemFilterParams {
  search?: string;
  category?: string;
  status?: string;
  priority?: string;
  favorite?: boolean;
}

// Fallback seed data in case backend server is unreachable
export const FALLBACK_SEED_ITEMS: Item[] = [
  {
    id: "1",
    title: "Morning Aviary Inspection & Feeding",
    subtitle: "Check finch enclosure humidity & refill organic seeds",
    notes: "1. Check temperature (keep at 24C)\n2. Refill vitamin water bottles\n3. Record singing activity",
    category: "birdcare",
    priority: "urgent",
    status: "done",
    dueDate: "2026-08-18",
    favorite: true,
    createdAt: "2026-08-17T07:00:00.000Z",
    updatedAt: "2026-08-18T08:00:00.000Z",
  },
  {
    id: "2",
    title: "KADA Project Integration Plan Review",
    subtitle: "Review React Native architecture & documentation checklist",
    notes: "Review docs/project-brief.md and technical best practices before sprint demo.",
    category: "study",
    priority: "high",
    status: "inprogress",
    dueDate: "2026-08-19",
    favorite: true,
    createdAt: "2026-08-17T09:30:00.000Z",
    updatedAt: "2026-08-17T14:00:00.000Z",
  },
  {
    id: "3",
    title: "Weekly Budget & Sanctuary Supplies Audit",
    subtitle: "Reconcile bird seed invoices and maintenance expenses",
    notes: "Total seed budget: 2,500,000 VND. Purchase new enrichment perches.",
    category: "finance",
    priority: "medium",
    status: "todo",
    dueDate: "2026-08-21",
    favorite: false,
    createdAt: "2026-08-16T11:00:00.000Z",
    updatedAt: "2026-08-16T11:00:00.000Z",
  },
  {
    id: "4",
    title: "Evening Jog & Breathwork Routine",
    subtitle: "5km outdoor run at the botanical park",
    notes: "Track heart rate and maintain 5:30 min/km pace.",
    category: "health",
    priority: "low",
    status: "todo",
    dueDate: "2026-08-18",
    favorite: false,
    createdAt: "2026-08-17T15:00:00.000Z",
    updatedAt: "2026-08-17T15:00:00.000Z",
  },
  {
    id: "5",
    title: "Sprint Planning & Team LittleBirdies Sync",
    subtitle: "Discuss Expo SDK 54 deployment with Khoa, Long, Hai, Nam & An",
    notes: "Agenda:\n- Expo Router v6 deep link testing\n- Offline SQLite vs AsyncStorage benchmarks\n- UI Polish & bilingual validation",
    category: "work",
    priority: "urgent",
    status: "inprogress",
    dueDate: "2026-08-18",
    favorite: true,
    createdAt: "2026-08-17T16:00:00.000Z",
    updatedAt: "2026-08-17T18:00:00.000Z",
  },
  {
    id: "6",
    title: "Mindfulness Meditation & Bird Sounds Listening",
    subtitle: "20 minutes sound bath with nature birdsong recordings",
    notes: "Relaxation exercise to improve focus and stress resilience.",
    category: "personal",
    priority: "low",
    status: "done",
    dueDate: "2026-08-17",
    favorite: false,
    createdAt: "2026-08-17T06:00:00.000Z",
    updatedAt: "2026-08-17T06:30:00.000Z",
  },
];

let localInMemoryItems: Item[] = [...FALLBACK_SEED_ITEMS];

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Attempt localhost, 127.0.0.1, and LAN IP
  const urlsToTry = [
    `http://localhost:5000${endpoint}`,
    `http://127.0.0.1:5000${endpoint}`,
    `http://10.110.206.83:5000${endpoint}`,
  ];

  for (const url of urlsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s fast timeout

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data as T;
    } catch (err) {
      // Continue to next URL
    }
  }

  // Offline Fallbacks if backend is not reachable
  console.log(`[Offline Mode] Backend unreachable for ${endpoint}, returning local fallback data.`);

  if (endpoint.startsWith('/api/auth/login')) {
    let email = 'user@littlebirdies.app';
    try {
      if (options.body) email = JSON.parse(options.body as string).email || email;
    } catch {}
    return {
      token: `demo-offline-token-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: email.includes('admin') ? 'admin' : email.includes('manager') ? 'manager' : 'student',
    } as unknown as T;
  }

  if (endpoint.startsWith('/api/items')) {
    if (options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body as string) : {};
      const newItem: Item = {
        id: String(Date.now()),
        title: body.title || 'New Offline Task',
        subtitle: body.subtitle || '',
        notes: body.notes || '',
        category: body.category || 'personal',
        priority: body.priority || 'medium',
        status: body.status || 'todo',
        dueDate: body.dueDate || '',
        favorite: body.favorite === true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localInMemoryItems.unshift(newItem);
      return newItem as unknown as T;
    }

    if (options.method === 'PUT') {
      const id = endpoint.split('/')[3];
      const body = options.body ? JSON.parse(options.body as string) : {};
      const idx = localInMemoryItems.findIndex((i) => i.id === id);
      if (idx !== -1) {
        localInMemoryItems[idx] = { ...localInMemoryItems[idx], ...body, updatedAt: new Date().toISOString() };
        return localInMemoryItems[idx] as unknown as T;
      }
    }

    if (options.method === 'DELETE') {
      const id = endpoint.split('/')[3];
      localInMemoryItems = localInMemoryItems.filter((i) => i.id !== id);
      return {} as T;
    }

    // GET single item
    if (endpoint.split('/').length === 4) {
      const id = endpoint.split('/')[3];
      const found = localInMemoryItems.find((i) => i.id === id);
      return (found || localInMemoryItems[0]) as unknown as T;
    }

    // GET /api/items list
    return localInMemoryItems as unknown as T;
  }

  if (endpoint === '/api/stats') {
    const total = localInMemoryItems.length;
    const completed = localInMemoryItems.filter((i) => i.status === 'done').length;
    const inProgress = localInMemoryItems.filter((i) => i.status === 'inprogress').length;
    const todo = localInMemoryItems.filter((i) => i.status === 'todo').length;
    const favorites = localInMemoryItems.filter((i) => i.favorite).length;

    const categoryBreakdown: Record<string, number> = {};
    const priorityBreakdown: Record<string, number> = {};

    localInMemoryItems.forEach((i) => {
      const cat = i.category || 'personal';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
      const pri = i.priority || 'medium';
      priorityBreakdown[pri] = (priorityBreakdown[pri] || 0) + 1;
    });

    return {
      total,
      completed,
      inProgress,
      todo,
      favorites,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      categoryBreakdown,
      priorityBreakdown,
    } as unknown as T;
  }

  return [] as unknown as T;
}

export const api = {
  login: (email: string) =>
    request<{ token: string; name: string; email: string; role: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  getItems: (params?: ItemFilterParams) => {
    let endpoint = '/api/items';
    if (params) {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.category && params.category !== 'all') query.append('category', params.category);
      if (params.status && params.status !== 'all') query.append('status', params.status);
      if (params.priority && params.priority !== 'all') query.append('priority', params.priority);
      if (params.favorite) query.append('favorite', 'true');
      const qs = query.toString();
      if (qs) endpoint += `?${qs}`;
    }
    return request<Item[]>(endpoint);
  },

  getItem: (id: string) => request<Item>(`/api/items/${id}`),

  createItem: (itemData: Partial<Item>) =>
    request<Item>('/api/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    }),

  updateItem: (id: string, itemData: Partial<Item>) =>
    request<Item>(`/api/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    }),

  deleteItem: (id: string) =>
    request<void>(`/api/items/${id}`, {
      method: 'DELETE',
    }),

  getStats: () => request<Stats>('/api/stats'),

  resetSeedData: () =>
    request<{ message: string; items: Item[] }>('/api/items/reset-seed', {
      method: 'POST',
    }),
};
