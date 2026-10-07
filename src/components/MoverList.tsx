import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatPrice, formatTurnover } from '../format';
import { changeColor, changeSoftColor, useTheme } from '../theme';
import { GlassCard } from './GlassCard';
import type { Mover } from '../types/movers';
import { ChangeBadge } from './ChangeBadge';

interface Props {
  title: string;
  direction: 'up' | 'down';
  movers: Mover[];
  currency: string;
  selectedSymbol: string | null;
  isWatched: (symbol: string) => boolean;
  onSelect: (mover: Mover) => void;
}

export function MoverList({ title, direction, movers, currency, selectedSymbol, isWatched, onSelect }: Props) {
  const theme = useTheme();
  const accent = direction === 'up' ? theme.up : theme.down;
  const maxChange = Math.max(...movers.map((m) => Math.abs(m.changePct)), 0.01);

  return (
    <GlassCard tint={direction === 'up' ? theme.glassUp : theme.glassDown} style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.headerIcon, { backgroundColor: direction === 'up' ? theme.upSoft : theme.downSoft }]}>
          <Ionicons name={direction === 'up' ? 'trending-up' : 'trending-down'} size={18} color={accent} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      </View>

      {movers.length === 0 ? (
        <Text style={{ color: theme.muted }}>Brak danych</Text>
      ) : (
        movers.map((mover, i) => {
          const color = changeColor(theme, mover.changePct);
          const soft = changeSoftColor(theme, mover.changePct);
          const selected = mover.symbol === selectedSymbol;
          return (
            <Pressable
              key={mover.symbol}
              onPress={() => onSelect(mover)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[
                styles.row,
                i > 0 && { borderTopColor: theme.border, borderTopWidth: StyleSheet.hairlineWidth },
                selected && { backgroundColor: soft },
              ]}
            >
              <View style={styles.rowMain}>
                <Text style={[styles.rank, { color: theme.muted }]}>{i + 1}</Text>
                <View style={[styles.avatar, { backgroundColor: soft }]}>
                  <Text style={[styles.avatarText, { color }]} numberOfLines={1}>
                    {mover.symbol.slice(0, 4)}
                  </Text>
                </View>
                <View style={styles.names}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
                      {mover.name}
                    </Text>
                    {isWatched(mover.symbol) && <Ionicons name="star" size={13} color={theme.star} />}
                  </View>
                  <Text style={[styles.meta, { color: theme.muted }]} numberOfLines={1}>
                    {formatPrice(mover.price, currency)} · obrót {formatTurnover(mover.turnover, currency)}
                  </Text>
                </View>
                <ChangeBadge value={mover.changePct} />
              </View>
              <View style={[styles.track, { backgroundColor: theme.border }]}>
                <View
                  style={[
                    styles.bar,
                    { backgroundColor: color, width: `${(Math.abs(mover.changePct) / maxChange) * 100}%` },
                  ]}
                />
              </View>
            </Pressable>
          );
        })
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: -8,
    borderRadius: 12,
    gap: 10,
  },
  rowMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rank: {
    width: 14,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  avatar: {
    width: 48,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  names: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  meta: {
    fontSize: 12,
    marginTop: 3,
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 4,
    borderRadius: 2,
    marginLeft: 26,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 2,
  },
});
