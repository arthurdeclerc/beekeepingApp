import { StyleSheet } from 'react-native';
import { colors, radius } from '../theme/theme';

export const styles = StyleSheet.create({
  formError: {
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.dangerBackground,
  },
});
