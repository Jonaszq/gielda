import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { changeArrow, formatChangePct } from '../format';
import { changeColor, changeSoftColor, glassTint, useTheme } from '../theme';
import { GlassCard } from './GlassCard';
import type { Mover } from '../types/movers';

interface Props {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  mover: Mover;
  selected: boolean;
  onPress: () => void;
}

export function HighlightTile({ label, icon, mover, selected, onPress }: Props) {
  const theme = useTheme();
  const color = changeColor(theme, mover.changePct);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={styles.pressable}
    >
      <GlassCard
        tint={glassTint(theme, mover.changePct)}
        borderColor={selected ? color : undefined}
        style={[styles.tile, selected && styles.tileSelected]}
      >
      <View style={[styles.icon, { backgroundColor: changeSoftColor(theme, mover.changePct) }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.label, { color: theme.muted }]}>{label}</Text>
      <Text style={[styles.symbol, { color: theme.text }]}>{mover.symbol}</Text>
      <Text style={[styles.change, { color }]}>
        {changeArrow(mover.changePct)} {formatChangePct(mover.changePct)}
      </Text>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  tile: {
    flex: 1,
    padding: 16,
  },
  tileSelected: {
    borderWidth: 2,
    padding: 15,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  symbol: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  change: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
});
