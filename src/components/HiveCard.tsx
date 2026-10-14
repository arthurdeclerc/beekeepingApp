import { Badge } from './primitives/Badge';
import { Card } from './primitives/Card';
import { Row } from './primitives/Row';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';
import { colors } from '../theme/theme';
import { HIVE_TYPE_LABELS } from '../utils/hiveTypes';
import type { Hive } from '../types/Hive';

interface HiveCardProps {
  hive: Hive;
}

export function HiveCard({ hive }: HiveCardProps) {
  return (
    <Card testID={`hive-card-${hive.id}`}>
      <Stack gap="sm" padding="md">
        <Row gap="sm" justify="space-between">
          <Stack flex={1}>
            <Text size="lg" weight="bold" numberOfLines={1}>{hive.name}</Text>
          </Stack>
          <Badge label={HIVE_TYPE_LABELS[hive.type]} variant="default" />
        </Row>
        {hive.notes !== '' && (
          <Text size="sm" color={colors.textMuted} numberOfLines={2}>{hive.notes}</Text>
        )}
      </Stack>
    </Card>
  );
}
