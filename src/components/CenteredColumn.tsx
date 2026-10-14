import { View, StyleSheet } from 'react-native';

// Vertically centered column that stays narrow on wide screens.
export function CenteredColumn({ children }: { children: React.ReactNode }) {
  return <View style={styles.base}>{children}</View>;
}

const styles = StyleSheet.create({
  base: { flex: 1, justifyContent: 'center', width: '100%', maxWidth: 420, alignSelf: 'center' },
});
