import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '../../src/state/useAuthStore';
import { Screen } from '../../src/components/primitives/Screen';
import { Spinner } from '../../src/components/primitives/Spinner';

export default function AppLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  // Wait for the stored session to load so a logged-in user doesn't see the login screen.
  if (!isInitialized) {
    return (
      <Screen scrollable={false}>
        <Spinner size="large" />
      </Screen>
    );
  }

  if (!isAuthenticated) return <Redirect href="/login" />;

  return <Stack />;
}
