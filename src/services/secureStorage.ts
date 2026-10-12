import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase stores the session (JWT access + refresh token) through this adapter.
// - Native: iOS Keychain / Android Keystore via expo-secure-store.
// - Web: AsyncStorage (browser storage); SecureStore does not exist there.
// SecureStore warns above ~2KB per value and a session is bigger, so we split it in chunks.
const CHUNK_SIZE = 1800;

const countKey = (key: string): string => `${key}.chunks`;
const chunkKey = (key: string, index: number): string => `${key}.${index}`;

async function readCount(key: string): Promise<number> {
  const rawCount = await SecureStore.getItemAsync(countKey(key));
  if (rawCount === null) return 0;
  const count = Number.parseInt(rawCount, 10);
  return Number.isNaN(count) ? 0 : count;
}

async function nativeGetItem(key: string): Promise<string | null> {
  const count = await readCount(key);
  if (count === 0) return null;

  const parts: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const part = await SecureStore.getItemAsync(chunkKey(key, i));
    if (part === null) return null; // corrupted entry: treat as logged out
    parts.push(part);
  }
  return parts.join('');
}

async function nativeRemoveItem(key: string): Promise<void> {
  const count = await readCount(key);
  for (let i = 0; i < count; i += 1) {
    await SecureStore.deleteItemAsync(chunkKey(key, i));
  }
  await SecureStore.deleteItemAsync(countKey(key));
}

async function nativeSetItem(key: string, value: string): Promise<void> {
  await nativeRemoveItem(key);
  const count = Math.ceil(value.length / CHUNK_SIZE);
  for (let i = 0; i < count; i += 1) {
    await SecureStore.setItemAsync(
      chunkKey(key, i),
      value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
    );
  }
  await SecureStore.setItemAsync(countKey(key), String(count));
}

// Static web export renders on a server (no window): there is no stored session to read there.
const isServerRender = Platform.OS === 'web' && typeof window === 'undefined';

export const sessionStorage = {
  getItem: (key: string): Promise<string | null> => {
    if (isServerRender) return Promise.resolve(null);
    return Platform.OS === 'web' ? AsyncStorage.getItem(key) : nativeGetItem(key);
  },
  setItem: (key: string, value: string): Promise<void> => {
    if (isServerRender) return Promise.resolve();
    return Platform.OS === 'web' ? AsyncStorage.setItem(key, value) : nativeSetItem(key, value);
  },
  removeItem: (key: string): Promise<void> => {
    if (isServerRender) return Promise.resolve();
    return Platform.OS === 'web' ? AsyncStorage.removeItem(key) : nativeRemoveItem(key);
  },
};
