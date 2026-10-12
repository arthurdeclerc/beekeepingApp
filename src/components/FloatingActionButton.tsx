import { Pressable } from 'react-native';
import { Icon } from './primitives/Icon';
import { colors } from '../theme/theme';
import { styles } from './FloatingActionButton.styles';

interface FloatingActionButtonProps {
  label: string;
  onPress: () => void;
  testID?: string;
}

// Primary action in the thumb zone (bottom right).
export function FloatingActionButton({ label, onPress, testID }: FloatingActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.base, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
    >
      <Icon name="add" size={28} color={colors.onPrimary} />
    </Pressable>
  );
}
