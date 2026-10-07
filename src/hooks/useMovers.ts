import { useCallback, useEffect, useState } from 'react';
import { moversRepository } from '../data';
import { loadCachedMovers, saveCachedMovers } from '../data/moversCache';
import type { Market, MoversResponse } from '../types/movers';

interface MoversState {
  data: MoversResponse | null;
  loading: boolean;
  /** Set when fresh data could not be loaded and `data` comes from the cache. */
  staleSince: string | null;
  error: string | null;
}

const INITIAL: MoversState = { data: null, loading: true, staleSince: null, error: null };

export function useMovers(market: Market) {
  const [state, setState] = useState<MoversState>(INITIAL);

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await moversRepository.getMovers(market);
      setState({ data, loading: false, staleSince: null, error: null });
      await saveCachedMovers(data);
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Nieznany błąd';
      const cached = await loadCachedMovers(market);
      setState({
        data: cached?.data ?? null,
        loading: false,
        staleSince: cached?.savedAt ?? null,
        error,
      });
    }
  }, [market]);

  useEffect(() => {
    setState(INITIAL);
    load();
  }, [load]);

  return { ...state, reload: load };
}
