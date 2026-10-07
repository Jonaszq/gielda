import { StyleSheet, Text, View } from 'react-native';
import { changeArrow, formatChangePct } from '../format';
import { changeColor, changeSoftColor, useTheme } from '../theme';

interface Props {
  value: number;
  size?: 'normal' | 'large';
}

export function ChangeBadge({ value, size = 'normal' }: Props) {
  const theme = useTheme();
  const large = size === 'large';

  return (
    <View style={[styles.badge, large && styles.badgeLarge, { backgroundColor: changeSoftColor(theme, value) }]}>
      <Text style={[styles.text, large && styles.textLarge, { color: changeColor(theme, value) }]}>
        {changeArrow(value)} {formatChangePct(value)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeLarge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  textLarge: {
    fontSize: 18,
  },
});
