import { View, Pressable } from 'react-native';

import { styles } from './Card.styles';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  testID?: string;
}

export function Card({ children, onPress, testID }: CardProps) {
  if (onPress !== undefined) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.base, pressed && styles.pressed]}
        accessibilityRole="button"
        testID={testID}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={styles.base} testID={testID}>{children}</View>;
}
