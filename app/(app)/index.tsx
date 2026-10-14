import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack as RouterStack, router } from 'expo-router';
import { useApiaryStore } from '../../src/state/useApiaryStore';
import { useAuthStore } from '../../src/state/useAuthStore';
import { ApiaryCard } from '../../src/components/ApiaryCard';
import { FloatingActionButton } from '../../src/components/FloatingActionButton';
import { Alert } from '../../src/components/Alert';
import { IconButton } from '../../src/components/IconButton';
import { StyledButton } from '../../src/components/StyledButton';
import { EmptyState } from '../../src/components/primitives/EmptyState';
import { Screen } from '../../src/components/primitives/Screen';
import { Skeleton } from '../../src/components/primitives/Skeleton';
import { Stack } from '../../src/components/primitives/Stack';
import { Text } from '../../src/components/primitives/Text';
import { colors } from '../../src/theme/theme';

export default function ApiariesScreen() {
  const { apiaries, hasLoaded, isLoading, error, loadApiaries } = useApiaryStore();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    void loadApiaries();
  }, [loadApiaries]);

  const openNewApiary = () => router.push('/apiary/new');

  return (
    <View style={{ flex: 1 }}>
      <RouterStack.Screen
        options={{
          title: 'My apiaries',
          headerRight: () => (
            <IconButton
              icon="log-out-outline"
              label="Log out"
              onPress={() => void logout()}
              testID="logout-button"
            />
          ),
        }}
      />
      <Screen padding="lg" refreshing={isLoading && hasLoaded} onRefresh={() => void loadApiaries()}>
        <Stack gap="md">
          {!hasLoaded && (
            <Stack gap="md" testID="apiaries-loading">
              <Skeleton height={76} borderRadius={12} />
              <Skeleton height={76} borderRadius={12} />
              <Skeleton height={76} borderRadius={12} />
            </Stack>
          )}

          {hasLoaded && error !== undefined && (
            <Stack gap="md">
              <Alert testID="apiaries-error">
                <Text size="sm" color={colors.danger}>{error}</Text>
              </Alert>
              <StyledButton label="Try again" variant="secondary" onPress={() => void loadApiaries()} />
            </Stack>
          )}

          {hasLoaded && error === undefined && apiaries.length === 0 && (
            <EmptyState
              title="No apiaries yet"
              description="Create your first apiary to start adding hives."
              action={
                <StyledButton label="Create apiary" onPress={openNewApiary} testID="empty-create-button" />
              }
            />
          )}

          {apiaries.map((apiary) => (
            <ApiaryCard
              key={apiary.id}
              apiary={apiary}
              onPress={() => router.push({ pathname: '/apiary/[id]', params: { id: apiary.id } })}
            />
          ))}

          {apiaries.length > 0 && <View style={{ height: 72 }} />}
        </Stack>
      </Screen>
      <FloatingActionButton label="New apiary" onPress={openNewApiary} testID="new-apiary-button" />
    </View>
  );
}
