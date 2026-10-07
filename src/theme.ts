import { useColorScheme } from 'react-native';

type Gradient = readonly [string, string];

const light = {
  background: '#F4F4F2',
  card: '#FFFFFF',
  text: '#0F172A',
  muted: '#64748B',
  border: '#E2E8F0',
  up: '#16A34A',
  down: '#DC2626',
  upSoft: 'rgba(22, 163, 74, 0.12)',
  downSoft: 'rgba(220, 38, 38, 0.12)',
  // Steel silver, dark enough to read on a light background.
  accent: '#6E747D',
  accentSoft: 'rgba(110, 116, 125, 0.14)',
  onAccent: '#FFFFFF',
  // White would disappear on the light background.
  star: '#111827',
  warningBg: '#FEF3C7',
  warningText: '#92400E',
  heroUp: ['#059669', '#0D9488'] as Gradient,
  heroDown: ['#E11D48', '#9F1239'] as Gradient,
  heroFlat: ['#475569', '#334155'] as Gradient,
  blurTint: 'light' as 'light' | 'dark',
  glass: 'rgba(255, 255, 255, 0.40)',
  glassBorder: 'rgba(255, 255, 255, 0.75)',
  glassUp: 'rgba(22, 163, 74, 0.10)',
  glassDown: 'rgba(220, 38, 38, 0.10)',
  glassAccent: 'rgba(110, 116, 125, 0.06)',
  // Silver, light silver, black.
  blobs: ['rgba(150, 156, 166, 0.55)', 'rgba(200, 204, 212, 0.60)', 'rgba(0, 0, 0, 0.35)'] as readonly [string, string, string],
};

export type Theme = typeof light;

const dark: Theme = {
  background: '#050505',
  card: '#12161C',
  text: '#F1F5F9',
  muted: '#94A3B8',
  border: '#1F2630',
  up: '#22C55E',
  down: '#F87171',
  upSoft: 'rgba(34, 197, 94, 0.15)',
  downSoft: 'rgba(248, 113, 113, 0.15)',
  accent: '#D1D5DB',
  accentSoft: 'rgba(209, 213, 219, 0.14)',
  onAccent: '#0A0A0A',
  star: '#FFFFFF',
  warningBg: '#3A2E10',
  warningText: '#FCD34D',
  heroUp: ['#047857', '#115E59'] as Gradient,
  heroDown: ['#BE123C', '#881337'] as Gradient,
  heroFlat: ['#334155', '#1E293B'] as Gradient,
  blurTint: 'dark',
  glass: 'rgba(18, 22, 30, 0.35)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassUp: 'rgba(34, 197, 94, 0.12)',
  glassDown: 'rgba(248, 113, 113, 0.12)',
  glassAccent: 'rgba(209, 213, 219, 0.06)',
  // Silver, dark silver, white.
  blobs: ['rgba(192, 196, 204, 0.50)', 'rgba(130, 136, 146, 0.50)', 'rgba(255, 255, 255, 0.30)'],
};

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}

export function changeColor(theme: Theme, value: number): string {
  return value > 0 ? theme.up : value < 0 ? theme.down : theme.muted;
}

export function changeSoftColor(theme: Theme, value: number): string {
  return value > 0 ? theme.upSoft : value < 0 ? theme.downSoft : theme.border;
}

export function heroGradient(theme: Theme, value: number): Gradient {
  return value > 0 ? theme.heroUp : value < 0 ? theme.heroDown : theme.heroFlat;
}

export function glassTint(theme: Theme, value: number): string {
  return value > 0 ? theme.glassUp : value < 0 ? theme.glassDown : 'transparent';
}
