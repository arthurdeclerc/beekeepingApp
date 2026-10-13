import { Text as RNText } from 'react-native';
import { styles } from './Text.styles';

interface TextProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  weight?: 'normal' | 'medium' | 'bold';
  color?: string;
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  testID?: string;
}

export function Text({
  children,
  size = 'md',
  weight = 'normal',
  color,
  align = 'left',
  numberOfLines,
  testID,
}: TextProps) {
  return (
    <RNText
      style={[
        styles.base,
        styles[size],
        styles[weight],
        { textAlign: align },
        color !== undefined && { color },
      ]}
      numberOfLines={numberOfLines}
      testID={testID}
    >
      {children}
    </RNText>
  );
}
