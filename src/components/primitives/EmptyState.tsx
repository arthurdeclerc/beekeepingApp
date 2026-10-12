import { View } from 'react-native';
import { Text } from './Text';
import { styles } from './EmptyState.styles';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <View style={styles.base}>
      <Text size="lg" weight="bold" align="center">{title}</Text>
      {description !== undefined && <Text align="center">{description}</Text>}
      {action !== undefined && <View style={styles.action}>{action}</View>}
    </View>
  );
}
