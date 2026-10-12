import { StyleSheet } from 'react-native';
import { spacing } from '../../theme/theme';

export const styles = StyleSheet.create({
  base: { flexDirection: 'row' },
  wrap: { flexWrap: 'wrap' },
  gap_none: {},
  gap_sm: { gap: spacing.sm },
  gap_md: { gap: spacing.md },
  gap_lg: { gap: spacing.lg },
});
