import { Pressable } from 'react-native';
import type { ComponentProps } from 'react';
import { Icon } from './primitives/Icon';
import { colors } from '../theme/theme';
import { styles } from './IconButton.styles';

interface IconButtonProps {
  icon: ComponentProps<typeof Icon>['name'];
  label: string;
  onPress: () => void;
  testID?: string;
}

export function IconButton({ icon, label, onPress, testID }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.base}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
    >
      <Icon name={icon} size={24} color={colors.text} />
    </Pressable>
  );
}
