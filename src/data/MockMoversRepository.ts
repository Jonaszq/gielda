import gpw from '../../assets/mock/gpw.json';
import usa from '../../assets/mock/usa.json';
import type { Market, MoversResponse } from '../types/movers';
import type { MoversRepository } from './MoversRepository';

const MOCKS: Record<Market, MoversResponse> = {
  gpw: gpw as MoversResponse,
  usa: usa as MoversResponse,
};

export class MockMoversRepository implements MoversRepository {
  async getMovers(market: Market): Promise<MoversResponse> {
    // Small delay so loading states are visible during development.
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCKS[market];
  }
}
