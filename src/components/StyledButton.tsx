import { Pressable } from 'react-native';
import { Spinner } from './primitives/Spinner';
import { Text } from './primitives/Text';
import { colors } from '../theme/theme';
import { styles } from './StyledButton.styles';

interface StyledButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  testID?: string;
}

export function StyledButton({
  label,
  onPress,
  variant = 'primary',
  isLoading = false,
  testID,
}: StyledButtonProps) {
  const textColor = variant === 'primary' ? colors.onPrimary : colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && variant === 'primary' && styles.primaryPressed,
        pressed && variant === 'secondary' && styles.secondaryPressed,
        isLoading && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isLoading, busy: isLoading }}
      testID={testID}
    >
      {isLoading ? (
        <Spinner size="small" color={textColor} />
      ) : (
        <Text weight="bold" size="lg" color={textColor}>{label}</Text>
      )}
    </Pressable>
  );
}
