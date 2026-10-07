import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { AppProvider } from '../context/AppContext';
import { useTheme } from '../theme';

export default function RootLayout() {
  const theme = useTheme();

  // On web the page behind the app is plain white; paint it and make the app fill the whole window.
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    for (const el of [document.documentElement, document.body, document.getElementById('root')]) {
      if (!el) continue;
      el.style.backgroundColor = theme.background;
      el.style.minHeight = '100dvh';
    }
  }, [theme.background]);

  return (
    <AppProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, title: 'Giełda' }} />
        <Stack.Screen name="settings" options={{ title: 'Ustawienia' }} />
      </Stack>
    </AppProvider>
  );
}
