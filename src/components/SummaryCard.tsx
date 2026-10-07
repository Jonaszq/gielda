import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { GlassCard } from './GlassCard';
import type { SummarySource } from '../types/movers';

export function SummaryCard({ summary, source }: { summary: string; source: SummarySource }) {
  const theme = useTheme();

  return (
    <GlassCard tint={theme.glassAccent} style={styles.card}>
      <View style={[styles.stripe, { backgroundColor: theme.accent }]} />
      <View style={styles.header}>
        <View style={[styles.icon, { backgroundColor: theme.accentSoft }]}>
          <Ionicons name="document-text-outline" size={18} color={theme.accent} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Podsumowanie sesji</Text>
        <View style={[styles.badge, { backgroundColor: theme.accentSoft }]}>
          {source === 'llm' && <Ionicons name="sparkles" size={11} color={theme.accent} />}
          <Text style={[styles.badgeText, { color: theme.accent }]}>{source === 'llm' ? 'AI' : 'Szablon'}</Text>
        </View>
      </View>
      <Text style={[styles.summary, { color: theme.text }]}>{summary}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    paddingLeft: 20,
    gap: 10,
  },
  stripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  summary: {
    fontSize: 15,
    lineHeight: 23,
  },
});
