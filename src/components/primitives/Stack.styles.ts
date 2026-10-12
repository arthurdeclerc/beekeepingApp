import { StyleSheet } from 'react-native';
import { spacing } from '../../theme/theme';

export const styles = StyleSheet.create({
  base: { flexDirection: 'column' },
  gap_none: {},
  gap_sm: { gap: spacing.sm },
  gap_md: { gap: spacing.md },
  gap_lg: { gap: spacing.lg },
  padding_none: {},
  padding_sm: { padding: spacing.sm },
  padding_md: { padding: spacing.md },
  padding_lg: { padding: spacing.lg },
});
