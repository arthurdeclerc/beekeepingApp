import { View } from 'react-native';
import { styles } from './Stack.styles';

interface StackProps {
  children: React.ReactNode;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  flex?: number;
  testID?: string;
}

export function Stack({
  children,
  gap = 'none',
  align = 'stretch',
  justify = 'flex-start',
  padding = 'none',
  flex,
  testID,
}: StackProps) {
  return (
    <View
      testID={testID}
      style={[
        styles.base,
        styles[`gap_${gap}` as keyof typeof styles],
        styles[`padding_${padding}` as keyof typeof styles],
        { alignItems: align, justifyContent: justify },
        flex !== undefined && { flex },
      ]}
    >
      {children}
    </View>
  );
}
