import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Stack as RouterStack, router, useLocalSearchParams } from 'expo-router';
import { useApiaryStore } from '../../../../src/state/useApiaryStore';
import { ApiaryForm } from '../../../../src/components/ApiaryForm';
import { StyledButton } from '../../../../src/components/StyledButton';
import { EmptyState } from '../../../../src/components/primitives/EmptyState';
import { Screen } from '../../../../src/components/primitives/Screen';
import { Skeleton } from '../../../../src/components/primitives/Skeleton';
import { canEditApiary } from '../../../../src/utils/apiaryPermissions';
import type { ApiaryInput } from '../../../../src/types/Apiary';

export default function EditApiaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { apiaries, hasLoaded, loadApiaries, updateApiary } = useApiaryStore();

  useEffect(() => {
    if (!hasLoaded) void loadApiaries();
  }, [hasLoaded, loadApiaries]);

  const apiary = apiaries.find((candidate) => candidate.id === id);

  const handleSubmit = async (input: ApiaryInput) => {
    if (apiary === undefined) return;
    await updateApiary(apiary.id, input);
    router.back();
  };

  if (!hasLoaded) {
    return (
      <Screen padding="lg">
        <Skeleton height={120} borderRadius={12} />
      </Screen>
    );
  }

  if (apiary === undefined || !canEditApiary(apiary.role)) {
    return (
      <Screen padding="lg">
        <EmptyState
          title="You can't edit this apiary"
          description="It does not exist, or your role does not allow changes."
          action={<StyledButton label="Back to my apiaries" onPress={() => router.replace('/')} />}
        />
      </Screen>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <RouterStack.Screen options={{ title: 'Edit apiary' }} />
      <Screen padding="lg">
        <ApiaryForm
          initialValues={{ name: apiary.name, address: apiary.address, notes: apiary.notes }}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}
