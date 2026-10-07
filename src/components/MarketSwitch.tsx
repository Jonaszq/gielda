import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme';
import { GlassCard } from './GlassCard';
import { MARKET_LABELS, MARKETS, type Market } from '../types/movers';

interface Props {
  value: Market;
  onChange: (market: Market) => void;
}

export function MarketSwitch({ value, onChange }: Props) {
  const theme = useTheme();

  return (
    <GlassCard style={styles.container}>
      {MARKETS.map((market) => {
        const selected = market === value;
        return (
          <Pressable
            key={market}
            onPress={() => onChange(market)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[styles.option, selected && { backgroundColor: theme.accent }]}
          >
            <Text style={[styles.label, { color: selected ? theme.onAccent : theme.muted }]}>
              {MARKET_LABELS[market]}
            </Text>
          </Pressable>
        );
      })}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
