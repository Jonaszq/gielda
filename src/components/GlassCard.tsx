import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  /** Colour laid over the frosted glass, e.g. a soft green for gainers. */
  tint?: string;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

/** Frosted, semi-transparent card. Only the background is blurred; the content stays sharp. */
export function GlassCard({ tint, borderColor, style, children }: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { borderColor: borderColor ?? theme.glassBorder }, style]}>
      <BlurView intensity={40} tint={theme.blurTint} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.glass }]} />
      {tint && <View style={[StyleSheet.absoluteFill, { backgroundColor: tint }]} />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
