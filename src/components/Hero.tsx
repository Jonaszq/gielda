import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { changeArrow, formatChangePct, formatDateTime, formatPrice, formatTurnover } from '../format';
import { heroGradient, useTheme } from '../theme';
import { GlassCard } from './GlassCard';
import { MARKET_CURRENCY, MARKET_LABELS, type Mover, type MoversResponse } from '../types/movers';

const MARKET_PLACE = { gpw: 'GPW · Warszawa', usa: 'USA · Nowy Jork' } as const;

interface Props {
  data: MoversResponse;
  /** Company shown instead of the index; null shows the index. */
  mover: Mover | null;
  watched: boolean;
  onToggleWatch: () => void;
  onClose: () => void;
}

export function Hero({ data, mover, watched, onToggleWatch, onClose }: Props) {
  const theme = useTheme();
  const change = mover ? mover.changePct : data.index.changePct;
  const currency = MARKET_CURRENCY[data.market];

  return (
    <GlassCard style={styles.hero}>
      {/* Semi-transparent gradient so the blurred backdrop shows through. */}
      <LinearGradient
        colors={heroGradient(theme, change)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, styles.gradient]}
      />
      <Ionicons
        name={change >= 0 ? 'trending-up' : 'trending-down'}
        size={160}
        color="rgba(255,255,255,0.12)"
        style={styles.watermark}
      />

      <View style={styles.topRow}>
        <Text style={styles.place}>
          {mover ? `${MARKET_LABELS[data.market]} · ${mover.symbol}` : MARKET_PLACE[data.market]}
        </Text>
        {mover && (
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Pokaż indeks" hitSlop={10}>
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </Pressable>
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {mover ? mover.name : data.index.symbol}
      </Text>
      <Text style={styles.change}>
        {changeArrow(change)} {formatChangePct(change)}
      </Text>

      <View style={styles.metaRow}>
        {mover ? (
          <>
            <Chip>{formatPrice(mover.price, currency)}</Chip>
            <Chip>obrót {formatTurnover(mover.turnover, currency)}</Chip>
          </>
        ) : (
          <>
            <Chip icon="time-outline">{formatDateTime(data.asOf)}</Chip>
            <Chip>{data.delayedMinutes > 0 ? `opóźnienie ${data.delayedMinutes} min` : 'dane z końca dnia'}</Chip>
          </>
        )}
      </View>

      {mover && (
        <Pressable
          onPress={onToggleWatch}
          accessibilityRole="button"
          accessibilityState={{ selected: watched }}
          style={[styles.watchButton, watched && styles.watchButtonActive]}
        >
          <Ionicons name={watched ? 'star' : 'star-outline'} size={18} color={watched ? '#0F172A' : '#FFFFFF'} />
          <Text style={[styles.watchText, watched && styles.watchTextActive]}>
            {watched ? 'Obserwujesz' : 'Obserwuj'}
          </Text>
        </Pressable>
      )}
    </GlassCard>
  );
}

function Chip({ icon, children }: { icon?: keyof typeof Ionicons.glyphMap; children: ReactNode }) {
  return (
    <View style={styles.chip}>
      {icon && <Ionicons name={icon} size={13} color="#FFFFFF" />}
      <Text style={styles.chipText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 24,
    padding: 20,
  },
  gradient: {
    opacity: 0.72,
  },
  watermark: {
    position: 'absolute',
    right: -16,
    bottom: -30,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 22,
  },
  place: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  change: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '900',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 16,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  watchButtonActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  watchText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  watchTextActive: {
    color: '#0F172A',
  },
});
