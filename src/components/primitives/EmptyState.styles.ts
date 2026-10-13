import { StyleSheet } from 'react-native';
import { spacing } from '../../theme/theme';

export const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  action: { marginTop: spacing.sm, alignSelf: 'stretch' },
});
