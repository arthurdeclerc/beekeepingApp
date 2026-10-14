import { Badge } from './primitives/Badge';
import { Card } from './primitives/Card';
import { Row } from './primitives/Row';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';
import { QueenColorDot } from './QueenColorDot';
import { colors } from '../theme/theme';
import { HIVE_TYPE_LABELS } from '../utils/hiveTypes';
import type { Hive } from '../types/Hive';

interface HiveCardProps {
  hive: Hive;
  // Only given when the signed-in user may edit hives.
  onPress?: () => void;
}

function queenSummary(hive: Hive): string {
  const { birthYear, breed, isMarked, isClipped, isMated } = hive.queen;
  const parts: string[] = [];
  if (birthYear !== undefined) parts.push(`Queen ${birthYear}`);
  if (breed !== '') parts.push(breed);
  if (isMarked) parts.push('marked');
  if (isClipped) parts.push('clipped');
  if (isMated) parts.push('mated');
  return parts.join(' · ');
}

export function HiveCard({ hive, onPress }: HiveCardProps) {
  const summary = queenSummary(hive);
  return (
    <Card onPress={onPress} testID={`hive-card-${hive.id}`}>
      <Stack gap="sm" padding="md">
        <Row gap="sm" justify="space-between">
          <Stack flex={1}>
            <Text size="lg" weight="bold" numberOfLines={1}>{hive.name}</Text>
          </Stack>
          <Badge label={HIVE_TYPE_LABELS[hive.type]} variant="default" />
        </Row>
        {summary !== '' && (
          <Row gap="sm">
            {hive.queen.birthYear !== undefined && <QueenColorDot year={hive.queen.birthYear} />}
            <Stack flex={1}>
              <Text size="sm" numberOfLines={1}>{summary}</Text>
            </Stack>
          </Row>
        )}
        {hive.notes !== '' && (
          <Text size="sm" color={colors.textMuted} numberOfLines={2}>{hive.notes}</Text>
        )}
      </Stack>
    </Card>
  );
}
