import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import type { QueryClient } from '@tanstack/react-query';
import { pokemonKeys, PAGE_SIZE } from '@/features/pokemon/hooks/usePokemonList';

const STORAGE_KEY = 'pokedex:pokemon-list-firstpage:v1';

async function storageGetItem(key: string): Promise<string | null> {
  const toSafeKey = (k: string) => k.replace(/[^A-Za-z0-9._-]/g, '_');
  try {
    return await AsyncStorage.getItem(key);
  } catch (e: any) {
    // AsyncStorage native module may be missing in Expo Go — fallback to SecureStore
    if (String(e?.message).includes('Native module is null')) {
      try {
        return await SecureStore.getItemAsync(toSafeKey(key));
      } catch (se) {
        // eslint-disable-next-line no-console
        console.warn('SecureStore get failed', se);
        return null;
      }
    }
    // eslint-disable-next-line no-console
    console.warn('AsyncStorage get failed', e);
    return null;
  }
}

async function storageSetItem(key: string, value: string): Promise<void> {
  const toSafeKey = (k: string) => k.replace(/[^A-Za-z0-9._-]/g, '_');
  try {
    await AsyncStorage.setItem(key, value);
    return;
  } catch (e: any) {
    if (String(e?.message).includes('Native module is null')) {
      try {
        await SecureStore.setItemAsync(toSafeKey(key), value);
        return;
      } catch (se) {
        // eslint-disable-next-line no-console
        console.warn('SecureStore set failed', se);
        return;
      }
    }
    // eslint-disable-next-line no-console
    console.warn('AsyncStorage set failed', e);
  }
}

export async function restorePokemonList(queryClient: QueryClient) {
  try {
    const raw = await storageGetItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed?.items) return;

    const pages = [{ items: parsed.items, nextOffset: parsed.nextOffset ?? null }];
    // Inject into the infinite query structure expected by useInfiniteQuery
    queryClient.setQueryData(pokemonKeys.list(), { pages, pageParams: [0] });
  } catch (e) {
    // Non-fatal: don't block app startup if restore fails
    // eslint-disable-next-line no-console
    console.warn('Failed to restore pokemon list from storage', e);
  }
}

export function setupPokemonListAutoSave(queryClient: QueryClient) {
  let last = '';

  const save = async () => {
    try {
      const data = queryClient.getQueryData<any>(pokemonKeys.list());
      const firstPage = data?.pages?.[0];
      if (!firstPage?.items) return;

      const items = firstPage.items.slice(0, PAGE_SIZE);
      const nextOffset = firstPage.nextOffset ?? null;
      const payload = JSON.stringify({ items, nextOffset });
      if (payload === last) return; // avoid writes if unchanged
      last = payload;
      await storageSetItem(STORAGE_KEY, payload);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to persist pokemon list', e);
    }
  };

  // Periodically persist. Returned cleanup clears the timer.
  const interval = setInterval(save, 3000);
  return () => clearInterval(interval);
}
