import type { Market, MoversResponse } from '../types/movers';

export interface MoversRepository {
  getMovers(market: Market): Promise<MoversResponse>;
}
