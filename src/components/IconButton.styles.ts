import { StyleSheet } from 'react-native';
import { touchTarget } from '../theme/theme';

export const styles = StyleSheet.create({
  base: {
    minWidth: touchTarget,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
