import { StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

export const styles = StyleSheet.create({
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  colorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  formError: {
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.dangerBackground,
  },
});
