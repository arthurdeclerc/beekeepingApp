import { StyleSheet } from 'react-native';
import { colors, radius } from '../../theme/theme';

export const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  pressed: { backgroundColor: colors.background },
});
