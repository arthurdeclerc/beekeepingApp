import { useEffect, useState } from 'react';
import { Stack as RouterStack, router, useLocalSearchParams } from 'expo-router';
import { useApiaryStore } from '../../../../src/state/useApiaryStore';
import { useHiveStore } from '../../../../src/state/useHiveStore';
import { Alert } from '../../../../src/components/Alert';
import { ApiarySwitcher } from '../../../../src/components/ApiarySwitcher';
import { HiveCard } from '../../../../src/components/HiveCard';
import { StyledButton } from '../../../../src/components/StyledButton';
import { Badge } from '../../../../src/components/primitives/Badge';
import { EmptyState } from '../../../../src/components/primitives/EmptyState';
import { Row } from '../../../../src/components/primitives/Row';
import { Screen } from '../../../../src/components/primitives/Screen';
import { Skeleton } from '../../../../src/components/primitives/Skeleton';
import { Stack } from '../../../../src/components/primitives/Stack';
import { Text } from '../../../../src/components/primitives/Text';
import { colors } from '../../../../src/theme/theme';
import { canAddHives, canDeleteApiary, canEditApiary, ROLE_LABELS } from '../../../../src/utils/apiaryPermissions';
import { messageForError } from '../../../../src/utils/errorMessages';

export default function ApiaryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { apiaries, hasLoaded, loadApiaries, deleteApiary } = useApiaryStore();
  const hives = useHiveStore((state) => (id === undefined ? undefined : state.hivesByApiary[id]));
  const hivesError = useHiveStore((state) => state.error);
  const loadHives = useHiveStore((state) => state.loadHives);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!hasLoaded) void loadApiaries();
  }, [hasLoaded, loadApiaries]);

  useEffect(() => {
    if (id !== undefined) void loadHives(id);
  }, [id, loadHives]);

  const apiary = apiaries.find((candidate) => candidate.id === id);

  const handleDelete = async () => {
    if (apiary === undefined) return;
    setDeleteError(undefined);
    setIsDeleting(true);
    try {
      await deleteApiary(apiary.id);
      router.replace('/');
    } catch (error) {
      setDeleteError(messageForError(error));
      setIsDeleting(false);
    }
  };

  if (!hasLoaded) {
    return (
      <Screen padding="lg">
        <Stack gap="md">
          <Skeleton height={32} width="60%" />
          <Skeleton height={20} width="40%" />
          <Skeleton height={80} borderRadius={12} />
        </Stack>
      </Screen>
    );
  }

  if (apiary === undefined) {
    return (
      <Screen padding="lg">
        <EmptyState
          title="Apiary not found"
          description="It may have been deleted, or you no longer have access."
          action={<StyledButton label="Back to my apiaries" onPress={() => router.replace('/')} />}
        />
      </Screen>
    );
  }

  return (
    <Screen padding="lg">
      <RouterStack.Screen options={{ title: apiary.name }} />
      <Stack gap="lg">
        {apiaries.length > 1 && (
          <ApiarySwitcher
            apiaries={apiaries}
            activeId={apiary.id}
            onSelect={(nextId) => router.replace({ pathname: '/apiary/[id]', params: { id: nextId } })}
          />
        )}

        <Stack gap="sm">
          <Row gap="sm" justify="space-between">
            <Stack flex={1}>
              <Text size="xl" weight="bold" testID="apiary-detail-name">{apiary.name}</Text>
            </Stack>
            <Badge
              label={ROLE_LABELS[apiary.role]}
              variant={apiary.role === 'owner' ? 'warning' : 'default'}
            />
          </Row>
          {apiary.address !== '' && <Text color={colors.textMuted}>{apiary.address}</Text>}
          {apiary.notes !== '' && <Text>{apiary.notes}</Text>}
        </Stack>

        <Stack gap="sm">
          <Text size="lg" weight="bold">Hives</Text>
          {hives === undefined && hivesError === undefined && <Skeleton height={76} borderRadius={12} />}
          {hives === undefined && hivesError !== undefined && (
            <Text size="sm" color={colors.danger}>{hivesError}</Text>
          )}
          {hives?.length === 0 && (
            <EmptyState title="No hives yet" description="Hives you add to this apiary will show up here." />
          )}
          {hives?.map((hive) => <HiveCard key={hive.id} hive={hive} />)}
          {canAddHives(apiary.role) && (
            <StyledButton
              label="Add hive"
              variant="secondary"
              onPress={() => router.push({ pathname: '/apiary/[id]/hive/new', params: { id: apiary.id } })}
              testID="add-hive-button"
            />
          )}
        </Stack>

        {(canEditApiary(apiary.role) || canDeleteApiary(apiary.role)) && (
          <Stack gap="md">
            {canEditApiary(apiary.role) && (
              <StyledButton
                label="Edit apiary"
                variant="secondary"
                onPress={() => router.push({ pathname: '/apiary/[id]/edit', params: { id: apiary.id } })}
                testID="edit-apiary-button"
              />
            )}
            {canDeleteApiary(apiary.role) && !isConfirmingDelete && (
              <StyledButton
                label="Delete apiary"
                variant="secondary"
                onPress={() => setIsConfirmingDelete(true)}
                testID="delete-apiary-button"
              />
            )}
            {canDeleteApiary(apiary.role) && isConfirmingDelete && (
              <Alert outlined testID="delete-confirm">
                <Stack gap="md">
                  <Text weight="bold">Delete {apiary.name}?</Text>
                  <Text size="sm">This also removes its hives and history. This cannot be undone.</Text>
                  {deleteError !== undefined && <Text size="sm" color={colors.danger}>{deleteError}</Text>}
                  <StyledButton
                    label="Yes, delete"
                    onPress={handleDelete}
                    isLoading={isDeleting}
                    testID="confirm-delete-button"
                  />
                  <StyledButton
                    label="Cancel"
                    variant="secondary"
                    onPress={() => setIsConfirmingDelete(false)}
                    testID="cancel-delete-button"
                  />
                </Stack>
              </Alert>
            )}
          </Stack>
        )}
      </Stack>
    </Screen>
  );
}
