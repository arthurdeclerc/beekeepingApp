import { Platform, StyleSheet } from 'react-native';
import { colors, radius, spacing, touchTarget } from '../../theme/theme';

// Web only: hide the browser's default focus ring; the field border shows focus instead.
// `as object`: react-native-web supports `outlineStyle`, but React Native's style types don't list it.
export const webNoOutline = Platform.OS === 'web' ? ({ outlineStyle: 'none', outlineWidth: 0 } as object) : {};

export const styles = StyleSheet.create({
  container: { gap: spacing.sm / 2 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: touchTarget,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  fieldFocused: { borderColor: colors.borderFocus, borderWidth: 3 },
  fieldError: { borderColor: colors.danger, borderWidth: 3 },
  input: {
    flex: 1,
    minHeight: touchTarget,
    fontSize: 16,
    color: colors.text,
  },
  toggle: {
    minWidth: 32,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
