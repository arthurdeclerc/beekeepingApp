import { Badge } from './primitives/Badge';
import { Card } from './primitives/Card';
import { Row } from './primitives/Row';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';
import { colors } from '../theme/theme';
import { ROLE_LABELS } from '../utils/apiaryPermissions';
import type { Apiary } from '../types/Apiary';

interface ApiaryCardProps {
  apiary: Apiary;
  onPress: () => void;
}

export function ApiaryCard({ apiary, onPress }: ApiaryCardProps) {
  return (
    <Card onPress={onPress} testID={`apiary-card-${apiary.id}`}>
      <Stack gap="sm" padding="md">
        <Row gap="sm" justify="space-between">
          <Stack flex={1}>
            <Text size="lg" weight="bold" numberOfLines={1}>{apiary.name}</Text>
          </Stack>
          <Badge
            label={ROLE_LABELS[apiary.role]}
            variant={apiary.role === 'owner' ? 'warning' : 'default'}
          />
        </Row>
        {apiary.address !== '' && (
          <Text size="sm" color={colors.textMuted} numberOfLines={1}>{apiary.address}</Text>
        )}
      </Stack>
    </Card>
  );
}
