import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../src/state/useAuthStore';

export default function RootLayout() {
  const initialize = useAuthStore((state) => state.initialize);

  // Restore the stored session and keep the JWT refreshed for the app's lifetime.
  useEffect(() => initialize(), [initialize]);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Slot />
    </SafeAreaProvider>
  );
}
