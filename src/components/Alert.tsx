import { View } from 'react-native';
import { styles } from './Alert.styles';

interface AlertProps {
  children: React.ReactNode;
  // Adds a danger border, for confirmations that need extra attention.
  outlined?: boolean;
  testID?: string;
}

// Red box for errors and destructive confirmations.
export function Alert({ children, outlined = false, testID }: AlertProps) {
  return (
    <View
      style={[styles.base, !outlined && styles.compact, outlined && styles.outlined]}
      accessibilityRole="alert"
      testID={testID}
    >
      {children}
    </View>
  );
}
