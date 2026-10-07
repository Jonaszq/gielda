const pctFormat = new Intl.NumberFormat('pl-PL', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const priceFormat = new Intl.NumberFormat('pl-PL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateTimeFormat = new Intl.DateTimeFormat('pl-PL', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

/** "+8,7%" / "−5,6%" / "0,0%". Sign is added manually because signDisplay is not supported everywhere. */
export function formatChangePct(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${pctFormat.format(Math.abs(value))}%`;
}

export function formatPrice(value: number, currency: string): string {
  return `${priceFormat.format(value)} ${currency}`;
}

export function formatDateTime(iso: string): string {
  return dateTimeFormat.format(new Date(iso));
}

const compactFormat = new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 1 });

/** "186,4 mln PLN". Done manually because compact notation is not supported everywhere. */
export function formatTurnover(value: number, currency: string): string {
  if (value >= 1e9) return `${compactFormat.format(value / 1e9)} mld ${currency}`;
  if (value >= 1e6) return `${compactFormat.format(value / 1e6)} mln ${currency}`;
  if (value >= 1e3) return `${compactFormat.format(value / 1e3)} tys. ${currency}`;
  return `${compactFormat.format(value)} ${currency}`;
}

export function changeArrow(value: number): string {
  return value > 0 ? '▲' : value < 0 ? '▼' : '■';
}
