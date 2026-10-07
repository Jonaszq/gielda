import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { WatchedCompany } from '../context/AppContext';
import { useTheme } from '../theme';
import type { Mover } from '../types/movers';
import { ChangeBadge } from './ChangeBadge';
import { GlassCard } from './GlassCard';

interface Props {
  companies: WatchedCompany[];
  /** Today's movers, used to show the change of watched companies that made the top 5. */
  movers: Mover[];
  onSelect: (mover: Mover) => void;
  onUnwatch: (company: WatchedCompany) => void;
}

export function WatchlistCard({ companies, movers, onSelect, onUnwatch }: Props) {
  const theme = useTheme();

  return (
    <GlassCard tint={theme.glassAccent} style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.headerIcon, { backgroundColor: theme.accentSoft }]}>
          <Ionicons name="star" size={18} color={theme.star} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Obserwowane</Text>
      </View>

      {companies.map((company, i) => {
        const mover = movers.find((m) => m.symbol === company.symbol);
        return (
          <View
            key={company.symbol}
            style={[styles.row, i > 0 && { borderTopColor: theme.border, borderTopWidth: StyleSheet.hairlineWidth }]}
          >
            <Pressable
              onPress={mover ? () => onSelect(mover) : undefined}
              disabled={!mover}
              accessibilityRole="button"
              style={styles.main}
            >
              <View style={styles.names}>
                <Text style={[styles.symbol, { color: theme.text }]}>{company.symbol}</Text>
                <Text style={[styles.name, { color: theme.muted }]} numberOfLines={1}>
                  {company.name}
                </Text>
              </View>
              {mover ? (
                <ChangeBadge value={mover.changePct} />
              ) : (
                <Text style={[styles.outside, { color: theme.muted }]}>dziś poza top 5</Text>
              )}
            </Pressable>
            <Pressable
              onPress={() => onUnwatch(company)}
              accessibilityRole="button"
              accessibilityLabel={`Przestań obserwować ${company.symbol}`}
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={20} color={theme.muted} />
            </Pressable>
          </View>
        );
      })}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  names: {
    flex: 1,
    minWidth: 0,
  },
  symbol: {
    fontSize: 15,
    fontWeight: '800',
  },
  name: {
    fontSize: 12,
    marginTop: 2,
  },
  outside: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});
