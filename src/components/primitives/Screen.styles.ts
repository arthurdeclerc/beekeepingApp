import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme/theme';

export const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1 },
  none: {},
  sm: { padding: spacing.sm },
  md: { padding: spacing.md },
  lg: { padding: spacing.lg },
});
