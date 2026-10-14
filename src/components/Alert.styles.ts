import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

export const styles = StyleSheet.create({
  base: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.dangerBackground,
  },
  compact: { padding: 12 },
  outlined: { borderWidth: 2, borderColor: colors.danger },
});
