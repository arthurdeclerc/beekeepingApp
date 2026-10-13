import { StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/theme';

const SIZE = 56;

export const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 3px 6px rgba(43, 29, 0, 0.25)',
  },
  pressed: { backgroundColor: colors.primaryPressed },
});
