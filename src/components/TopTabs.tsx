import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';

export interface TabItem<T extends string> {
  key: T;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: number;
}

interface Props<T extends string> {
  tabs: TabItem<T>[];
  value: T;
  onChange: (key: T) => void;
}

export function TopTabs<T extends string>({ tabs, value, onChange }: Props<T>) {
  const theme = useTheme();

  return (
    <View style={[styles.bar, { borderBottomColor: theme.border }]} accessibilityRole="tablist">
      {tabs.map((tab) => {
        const selected = tab.key === value;
        const color = selected ? theme.accent : theme.muted;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={styles.tab}
          >
            <View style={styles.tabContent}>
              <Ionicons name={tab.icon} size={18} color={color} />
              <Text style={[styles.label, { color }]}>{tab.label}</Text>
              {!!tab.badge && (
                <View style={[styles.badge, { backgroundColor: selected ? theme.accent : theme.border }]}>
                  <Text style={[styles.badgeText, { color: selected ? theme.onAccent : theme.text }]}>{tab.badge}</Text>
                </View>
              )}
            </View>
            <View style={[styles.indicator, selected && { backgroundColor: theme.accent }]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  indicator: {
    height: 3,
    width: '70%',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});
