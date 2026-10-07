import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Backdrop } from '../components/Backdrop';
import { GlassCard } from '../components/GlassCard';
import { MarketSwitch } from '../components/MarketSwitch';
import { useApp } from '../context/AppContext';
import { useTheme } from '../theme';

interface SectionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  children: ReactNode;
}

function Section({ icon, title, description, children }: SectionProps) {
  const theme = useTheme();

  return (
    <GlassCard style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.icon, { backgroundColor: theme.accentSoft }]}>
          <Ionicons name={icon} size={18} color={theme.accent} />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.description, { color: theme.muted }]}>{description}</Text>
        </View>
      </View>
      {children}
    </GlassCard>
  );
}

export default function SettingsScreen() {
  const theme = useTheme();
  const { settings, updateSettings } = useApp();

  const inputStyle = [
    styles.input,
    { color: theme.text, backgroundColor: theme.glass, borderColor: theme.glassBorder },
  ];

  return (
    <View style={styles.screen}>
      <Backdrop />
      <ScrollView contentContainerStyle={styles.content}>
        <Section icon="stats-chart" title="Widżet" description="Który rynek pokazuje widżet na ekranie głównym.">
          <MarketSwitch value={settings.widgetMarket} onChange={(widgetMarket) => updateSettings({ widgetMarket })} />
        </Section>

        <Section icon="pulse" title="Połączenie z serwerem" description="Na razie nieużywane – aplikacja działa na danych przykładowych.">
          <Text style={[styles.label, { color: theme.muted }]}>Adres API</Text>
          <TextInput
            style={inputStyle}
            value={settings.apiUrl}
            onChangeText={(apiUrl) => updateSettings({ apiUrl })}
            placeholder="https://…"
            placeholderTextColor={theme.muted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          <Text style={[styles.label, { color: theme.muted }]}>Token</Text>
          <TextInput
            style={inputStyle}
            value={settings.apiToken}
            onChangeText={(apiToken) => updateSettings({ apiToken })}
            placeholder="Token dostępu"
            placeholderTextColor={theme.muted}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  card: {
    padding: 16,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  cardHeaderText: {
    flex: 1,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
  },
  description: {
    fontSize: 13,
    marginTop: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 16,
  },
});
