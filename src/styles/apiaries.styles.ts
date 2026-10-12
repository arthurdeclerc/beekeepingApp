import { StyleSheet } from 'react-native';
import { colors, radius, touchTarget } from '../theme/theme';

export const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  // Keeps the last card clear of the floating action button.
  fabSpace: { height: 72 },
  logout: {
    minWidth: touchTarget,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.dangerBackground,
  },
  deleteBox: {
    padding: 16,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.danger,
    backgroundColor: colors.dangerBackground,
  },
  dangerButton: { backgroundColor: colors.danger },
});
