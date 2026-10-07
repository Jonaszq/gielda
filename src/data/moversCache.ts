import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Market, MoversResponse } from '../types/movers';

export interface CachedMovers {
  data: MoversResponse;
  /** ISO timestamp of when the data was fetched. */
  savedAt: string;
}

const key = (market: Market) => `movers:${market}`;

export async function saveCachedMovers(data: MoversResponse): Promise<void> {
  const entry: CachedMovers = { data, savedAt: new Date().toISOString() };
  await AsyncStorage.setItem(key(data.market), JSON.stringify(entry));
}

export async function loadCachedMovers(market: Market): Promise<CachedMovers | null> {
  const raw = await AsyncStorage.getItem(key(market));
  return raw ? (JSON.parse(raw) as CachedMovers) : null;
}
