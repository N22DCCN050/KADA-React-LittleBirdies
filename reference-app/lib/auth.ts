import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'user_auth_token';

let inMemoryToken: string | null = null;

export async function saveToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    inMemoryToken = token;
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {}
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(TOKEN_KEY) || inMemoryToken;
    } catch {
      return inMemoryToken;
    }
  }
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken(): Promise<void> {
  if (Platform.OS === 'web') {
    inMemoryToken = null;
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
