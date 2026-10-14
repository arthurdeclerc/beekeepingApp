import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Stack as RouterStack, router, useLocalSearchParams } from 'expo-router';
import { useApiaryStore } from '../../../../../src/state/useApiaryStore';
import { useHiveStore } from '../../../../../src/state/useHiveStore';
import { HiveForm } from '../../../../../src/components/HiveForm';
import { StyledButton } from '../../../../../src/components/StyledButton';
import { EmptyState } from '../../../../../src/components/primitives/EmptyState';
import { Screen } from '../../../../../src/components/primitives/Screen';
import { Skeleton } from '../../../../../src/components/primitives/Skeleton';
import { Stack } from '../../../../../src/components/primitives/Stack';
import { Text } from '../../../../../src/components/primitives/Text';
import { colors } from '../../../../../src/theme/theme';
import { canAddHives } from '../../../../../src/utils/apiaryPermissions';
import type { HiveInput } from '../../../../../src/types/Hive';

export default function NewHiveScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { apiaries, hasLoaded, loadApiaries } = useApiaryStore();
  const createHive = useHiveStore((state) => state.createHive);

  useEffect(() => {
    if (!hasLoaded) void loadApiaries();
  }, [hasLoaded, loadApiaries]);

  const apiary = apiaries.find((candidate) => candidate.id === id);

  const handleSubmit = async (input: HiveInput) => {
    if (apiary === undefined) return;
    await createHive(apiary.id, input);
    router.back();
  };

  if (!hasLoaded) {
    return (
      <Screen padding="lg">
        <Skeleton height={120} borderRadius={12} />
      </Screen>
    );
  }

  if (apiary === undefined || !canAddHives(apiary.role)) {
    return (
      <Screen padding="lg">
        <EmptyState
          title="You can't add hives here"
          description="This apiary does not exist, or your role does not allow changes."
          action={<StyledButton label="Back to my apiaries" onPress={() => router.replace('/')} />}
        />
      </Screen>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <RouterStack.Screen options={{ title: 'New hive' }} />
      <Screen padding="lg">
        <Stack gap="lg">
          <Text color={colors.textMuted}>Adding to {apiary.name}</Text>
          <HiveForm submitLabel="Save hive" onSubmit={handleSubmit} />
        </Stack>
      </Screen>
    </KeyboardAvoidingView>
  );
}
