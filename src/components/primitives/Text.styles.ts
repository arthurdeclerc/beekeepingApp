import { StyleSheet } from 'react-native';
import { colors } from '../../theme/theme';

export const styles = StyleSheet.create({
  base: {
    color: colors.text,
  },
  sm: { fontSize: 12, lineHeight: 16 },
  md: { fontSize: 14, lineHeight: 20 },
  lg: { fontSize: 16, lineHeight: 24 },
  xl: { fontSize: 20, lineHeight: 28 },
  xxl: { fontSize: 32, lineHeight: 40 },
  normal: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  bold: { fontWeight: '700' },
});
