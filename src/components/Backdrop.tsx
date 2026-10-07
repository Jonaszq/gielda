import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';

/** Colourful blurred blobs behind the glass cards, so the cards have something to blur. */
export function Backdrop() {
  const theme = useTheme();
  const [silver, darkSilver, contrast] = theme.blobs;

  return (
    <View style={[StyleSheet.absoluteFill, styles.container, { backgroundColor: theme.background }]} pointerEvents="none">
      <View style={[styles.blob, styles.blobTopLeft, { backgroundColor: silver }]} />
      <View style={[styles.blob, styles.blobMiddleRight, { backgroundColor: darkSilver }]} />
      <View style={[styles.blob, styles.blobBottomLeft, { backgroundColor: contrast }]} />
      {/* iOS ignores the CSS blur filter, so the blobs are softened with a native blur instead. */}
      {Platform.OS === 'ios' && <BlurView intensity={100} tint={theme.blurTint} style={StyleSheet.absoluteFill} />}
    </View>
  );
}

const BLOB_SIZE = 360;

const styles = StyleSheet.create({
  // Keeps the blurred blobs from spilling outside the screen.
  container: {
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    width: BLOB_SIZE,
    height: BLOB_SIZE,
    borderRadius: BLOB_SIZE / 2,
    filter: Platform.OS === 'ios' ? undefined : 'blur(90px)',
  },
  blobTopLeft: {
    top: -80,
    left: -120,
  },
  blobMiddleRight: {
    top: '35%',
    right: -140,
  },
  blobBottomLeft: {
    bottom: -60,
    left: -60,
  },
});
