import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { isMarket, type Market } from '../types/movers';

export interface Settings {
  widgetMarket: Market;
  apiUrl: string;
  apiToken: string;
}

export interface WatchedCompany {
  market: Market;
  symbol: string;
  name: string;
}

interface AppContextValue {
  market: Market;
  setMarket: (market: Market) => void;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  watchlist: WatchedCompany[];
  isWatched: (market: Market, symbol: string) => boolean;
  toggleWatch: (company: WatchedCompany) => void;
}

const SETTINGS_KEY = 'settings';
const WATCHLIST_KEY = 'watchlist';

const DEFAULT_SETTINGS: Settings = {
  widgetMarket: 'gpw',
  apiUrl: '',
  apiToken: '',
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [market, setMarket] = useState<Market>('gpw');
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [watchlist, setWatchlist] = useState<WatchedCompany[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((raw) => {
      if (!raw) return;
      const stored = JSON.parse(raw) as Partial<Settings>;
      setSettings({
        ...DEFAULT_SETTINGS,
        ...stored,
        widgetMarket: isMarket(stored.widgetMarket) ? stored.widgetMarket : DEFAULT_SETTINGS.widgetMarket,
      });
    });
    AsyncStorage.getItem(WATCHLIST_KEY).then((raw) => {
      if (!raw) return;
      const stored = JSON.parse(raw) as WatchedCompany[];
      // Merge in case something was toggled before storage finished loading.
      setWatchlist((prev) => {
        if (prev.length === 0) return stored;
        const merged = [
          ...stored,
          ...prev.filter((c) => !stored.some((s) => s.market === c.market && s.symbol === c.symbol)),
        ];
        AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(merged));
        return merged;
      });
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isWatched = useCallback(
    (m: Market, symbol: string) => watchlist.some((c) => c.market === m && c.symbol === symbol),
    [watchlist],
  );

  const toggleWatch = useCallback((company: WatchedCompany) => {
    setWatchlist((prev) => {
      const exists = prev.some((c) => c.market === company.market && c.symbol === company.symbol);
      const next = exists
        ? prev.filter((c) => !(c.market === company.market && c.symbol === company.symbol))
        : [...prev, company];
      AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{ market, setMarket, settings, updateSettings, watchlist, isWatched, toggleWatch }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside AppProvider');
  return value;
}
