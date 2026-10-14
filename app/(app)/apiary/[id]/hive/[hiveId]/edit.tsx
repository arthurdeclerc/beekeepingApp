import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Stack as RouterStack, router, useLocalSearchParams } from 'expo-router';
import { useApiaryStore } from '../../../../../../src/state/useApiaryStore';
import { useHiveStore } from '../../../../../../src/state/useHiveStore';
import { HiveForm } from '../../../../../../src/components/HiveForm';
import { StyledButton } from '../../../../../../src/components/StyledButton';
import { EmptyState } from '../../../../../../src/components/primitives/EmptyState';
import { Screen } from '../../../../../../src/components/primitives/Screen';
import { Skeleton } from '../../../../../../src/components/primitives/Skeleton';
import { canAddHives } from '../../../../../../src/utils/apiaryPermissions';
import type { HiveInput } from '../../../../../../src/types/Hive';

export default function EditHiveScreen() {
  const { id, hiveId } = useLocalSearchParams<{ id: string; hiveId: string }>();
  const { apiaries, hasLoaded, loadApiaries } = useApiaryStore();
  const hives = useHiveStore((state) => (id === undefined ? undefined : state.hivesByApiary[id]));
  const loadHives = useHiveStore((state) => state.loadHives);
  const updateHive = useHiveStore((state) => state.updateHive);

  useEffect(() => {
    if (!hasLoaded) void loadApiaries();
  }, [hasLoaded, loadApiaries]);

  useEffect(() => {
    if (id !== undefined && hives === undefined) void loadHives(id);
  }, [id, hives, loadHives]);

  const apiary = apiaries.find((candidate) => candidate.id === id);
  const hive = hives?.find((candidate) => candidate.id === hiveId);

  const handleSubmit = async (input: HiveInput) => {
    if (apiary === undefined || hive === undefined) return;
    await updateHive(apiary.id, hive.id, input);
    router.back();
  };

  if (!hasLoaded || hives === undefined) {
    return (
      <Screen padding="lg">
        <Skeleton height={120} borderRadius={12} />
      </Screen>
    );
  }

  if (apiary === undefined || hive === undefined || !canAddHives(apiary.role)) {
    return (
      <Screen padding="lg">
        <EmptyState
          title="You can't edit this hive"
          description="It does not exist, or your role does not allow changes."
          action={<StyledButton label="Back to my apiaries" onPress={() => router.replace('/')} />}
        />
      </Screen>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <RouterStack.Screen options={{ title: 'Edit hive' }} />
      <Screen padding="lg">
        <HiveForm
          initialValues={{ name: hive.name, type: hive.type, notes: hive.notes, queen: hive.queen }}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}
