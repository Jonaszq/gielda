// Mirrors the JSON contract shared with the backend. Do not change without agreeing on the contract first.

export type Market = 'gpw' | 'usa';

export type SummarySource = 'llm' | 'template';

export interface IndexChange {
  symbol: string;
  changePct: number;
}

export interface Mover {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  turnover: number;
}

export interface MoversResponse {
  market: Market;
  /** ISO 8601 timestamp with offset, e.g. "2026-10-02T17:05:00+02:00". */
  asOf: string;
  delayedMinutes: number;
  index: IndexChange;
  /** Max 5 entries, sorted from the largest change. */
  gainers: Mover[];
  /** Max 5 entries, sorted from the largest change. */
  losers: Mover[];
  summary: string;
  summarySource: SummarySource;
}

export const MARKETS: Market[] = ['gpw', 'usa'];

export const MARKET_LABELS: Record<Market, string> = {
  gpw: 'GPW',
  usa: 'USA',
};

export const MARKET_CURRENCY: Record<Market, string> = {
  gpw: 'PLN',
  usa: 'USD',
};

export function isMarket(value: unknown): value is Market {
  return value === 'gpw' || value === 'usa';
}
